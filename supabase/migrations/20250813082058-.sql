-- 1) Add position column to control ordering
ALTER TABLE public.editorials
ADD COLUMN IF NOT EXISTS position integer NOT NULL DEFAULT 0;

-- 2) Function to auto-assign position on insert (max(position)+1 when not provided)
CREATE OR REPLACE FUNCTION public.set_editorial_position()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.position IS NULL OR NEW.position = 0 THEN
    SELECT COALESCE(MAX(position), 0) + 1 INTO NEW.position FROM public.editorials;
  END IF;
  RETURN NEW;
END;
$$;

-- 3) Trigger to call the function before insert
DROP TRIGGER IF EXISTS trg_set_editorial_position ON public.editorials;
CREATE TRIGGER trg_set_editorial_position
BEFORE INSERT ON public.editorials
FOR EACH ROW
EXECUTE FUNCTION public.set_editorial_position();

-- 4) Initialize existing rows with a stable ordering by created_at
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) AS rn
  FROM public.editorials
)
UPDATE public.editorials e
SET position = o.rn
FROM ordered o
WHERE o.id = e.id AND e.position = 0;

-- 5) Index to speed up ordering by position
CREATE INDEX IF NOT EXISTS idx_editorials_position ON public.editorials(position ASC);

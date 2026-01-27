import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface EditorialRow {
  id: string;
  title: string;
  is_published: boolean;
  updated_at: string;
  slug: string;
}

const RecentEditorials = () => {
  const [rows, setRows] = useState<EditorialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadEditorials = async () => {
    const { data, error } = await supabase
      .from("editorials")
      .select("id,title,is_published,updated_at,slug")
      .order("updated_at", { ascending: false })
      .limit(5);
    if (error) {
      console.error("Failed to load recent editorials", error);
    }
    setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadEditorials();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    try {
      const { error } = await supabase
        .from('editorials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({ 
        title: "Editorial deleted", 
        description: `"${title}" has been deleted successfully` 
      });
      
      // Reload the list
      loadEditorials();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({ 
        title: "Delete failed", 
        description: error.message || "Failed to delete editorial" 
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent editorials</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <div className="text-sm text-muted-foreground">No editorials yet.</div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Updated</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <Link to={`/editorial/${r.slug}`} className="story-link">
                          {r.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={r.is_published ? "default" : "secondary"}>
                          {r.is_published ? "published" : "draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {format(new Date(r.updated_at), "MMM d, yyyy p")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/edit/${r.id}`} className="flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2 text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Editorial</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{r.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDelete(r.id, r.title)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Mobile card layout */}
            <div className="md:hidden space-y-3">
              {rows.map((r) => (
                <Card key={r.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <Link to={`/editorial/${r.slug}`} className="story-link block">
                        <h3 className="font-medium text-sm leading-tight mb-2 pr-2">{r.title}</h3>
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant={r.is_published ? "default" : "secondary"} className="text-xs">
                          {r.is_published ? "published" : "draft"}
                        </Badge>
                        <span>{format(new Date(r.updated_at), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/edit/${r.id}`} className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2 text-destructive">
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Editorial</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{r.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(r.id, r.title)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
        <div className="mt-4 flex justify-end">
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/write">Write editorial</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentEditorials;

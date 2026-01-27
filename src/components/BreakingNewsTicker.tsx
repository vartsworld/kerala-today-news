import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const BreakingNewsTicker = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const breakingNews = [
    "ഇന്നത്തെ സ്വർണ്ണവില വർദ്ധന",
    "കുണ്ടറ പഞ്ചായത്തിൽ പുതിയ വികസന പദ്ധതികൾ",
    "മന്ത്രി കെഎൻ ബാലഗോപാലിന്റെ കോട്ടാരക്കര സന്ദർശനം",
    "കോട്ടാരക്കരയിൽ പുതിയ വിദ്യാഭ്യാസ പരിഷ്കാരങ്ങൾ",
    "കൊല്ലം ജില്ലയിലെ ഏറ്റവും പുതിയ വാർത്തകൾ Kerala Today News ൽ",
    "സാമുദായിക വികസനത്തിനായുള്ള പുതിയ നയങ്ങൾ"
  ];

  return (
    <div className="bg-destructive text-destructive-foreground py-1.5 sm:py-2 overflow-hidden relative border-y">
      <div className="container mx-auto px-4 flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Badge variant="secondary" className="bg-background text-foreground font-bold px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm relative overflow-hidden animate-shine">
            BREAKING
          </Badge>
          <div className="hidden sm:flex items-center gap-1 text-xs">
            <Clock className="h-3 w-3" />
            <span>{currentTime.toLocaleTimeString('en-IN', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="animate-scroll whitespace-nowrap">
            <span className="inline-block">
              {breakingNews.map((news, index) => (
                <span key={index} className="mx-4 sm:mx-8 text-xs sm:text-sm font-medium">
                  • {news}
                </span>
              ))}
              {/* Duplicate for seamless loop */}
              {breakingNews.map((news, index) => (
                <span key={`duplicate-${index}`} className="mx-4 sm:mx-8 text-xs sm:text-sm font-medium">
                  • {news}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsTicker;

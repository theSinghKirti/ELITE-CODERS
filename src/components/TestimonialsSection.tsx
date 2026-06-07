import { motion } from "motion/react";
import { Star, MessageSquareQuote } from "lucide-react";
import { Card, CardContent } from "./ui/Card";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Marcus Koh",
      role: "Software Developer",
      initials: "MK",
      glowingPreset: "from-teal/30 to-emerald/20 text-teal-600 dark:text-teal-400",
      quote: "The voice recognition is absolutely stunning. I described detailed migraine symptoms and the assistant drafted a clear, structured summary that I literally showed to my primary doctor.",
    },
    {
      name: "Sarah Ramirez",
      role: "Personal Trainer",
      initials: "SR",
      glowingPreset: "from-teal-400/20 to-emerald-400/20 text-emerald-600 dark:text-emerald-400",
      quote: "When I experienced sudden knee alignment pain after training, the triage logic gave me immediate, logical, and composed guidance on resting phases. It completely removed the panic of searching self-diagnostics.",
    },
    {
      name: "Eleanor Vance",
      role: "Retired Educator",
      initials: "EV",
      glowingPreset: "from-teal/35 to-teal/10 text-teal",
      quote: "This is a masterpiece of accessibility. As someone who finds typing on phone keyboards difficult, being able to simply voice clinical details, and get structured lists back, has been incredibly freeing.",
    },
  ];

  return (
    <section id="testimonials" className="relative py-20 lg:py-24 bg-slate-100/40 dark:bg-slate-950/20 border-y border-slate-200/40 dark:border-slate-900/10 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="mx-auto max-w-2xl text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 justify-center">
            <MessageSquareQuote className="h-4 w-4" /> Real Feedback
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Trusted by Early Users
          </h2>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium">
            Discover how our conversational medical companion helps everyday individuals demystify physical symptoms peacefully.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((test, index) => (
            <motion.div
              key={test.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              {/* Card wrapper */}
              <Card className="h-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/50 dark:border-slate-800/80 p-6 flex flex-col justify-between hover:scale-[1.01] hover:bg-white/80 dark:hover:bg-slate-900/80 transition-all duration-300 shadow-xs">
                <CardContent className="p-0 space-y-5">
                  {/* Rating Stars */}
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Feedback Text */}
                  <p className="text-sm leading-relaxed text-slate-755 dark:text-slate-350 font-medium italic">
                    "{test.quote}"
                  </p>

                  {/* Avatar User details */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className={`flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-xl font-bold text-sm bg-gradient-to-tr ${test.glowingPreset}`}>
                      {test.initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {test.name}
                      </h4>
                      <p className="text-xs font-semibold text-slate-400">
                        {test.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

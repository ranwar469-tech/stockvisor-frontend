import { ArrowLeft } from 'lucide-react';


export default function TipsComponent({ tip, onClose }) {
  if (!tip) return null;

  const difficultyClasses = {
    Beginner:
      'bg-[#edfaf4] dark:bg-[#114832]/20 text-[#2ebd85] border border-[#aae4cc] dark:border-[#1b7350]',
    Intermediate:
      'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 border border-yellow-200 dark:border-yellow-800',
    Advanced:
      'bg-rose-50 dark:bg-rose-900/20 text-rose-600 border border-rose-200 dark:border-rose-800',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-[#2ebd85] overflow-hidden transition-colors duration-300 flex flex-col">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700 flex items-center gap-4 shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-[#2ebd85] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          All Tips
        </button>
        <div className="h-4 w-px bg-slate-300 dark:bg-gray-600" />
        <span className="text-lg font-semibold text-slate-900 dark:text-white truncate">{tip.title}</span>
        <span className={`ml-auto shrink-0 px-2 py-1 rounded text-xs font-semibold ${difficultyClasses[tip.difficulty] || ''}`}>
          {tip.difficulty}
        </span>
      </div>

           <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
      
        <div className="flex items-start gap-4">
          <span className="text-5xl select-none">{tip.icon}</span>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{tip.title}</h2>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed">{tip.description}</p>
          </div>
        </div>

        {tip.overview && (
          <section>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Overview</h3>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed">{tip.overview}</p>
          </section>
        )}

        {tip.keyPoints?.length > 0 && (
          <section>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Key Points</h3>
            <ul className="space-y-2">
              {tip.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 w-5 h-5 rounded-full bg-[#edfaf4] dark:bg-[#114832]/30 border border-[#2ebd85] flex items-center justify-center text-[#2ebd85] text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-slate-600 dark:text-gray-400 leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {tip.steps?.length > 0 && (
          <section>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">How To Apply</h3>
            <ol className="space-y-3">
              {tip.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-[#2ebd85] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{step.title}</p>
                    {step.detail && (
                      <p className="text-slate-600 dark:text-gray-400 text-sm mt-0.5 leading-relaxed">{step.detail}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {tip.example && (
          <section>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Example</h3>
            <div className="rounded-lg border border-[#2ebd85] bg-[#edfaf4] dark:bg-[#0d2b1e] px-5 py-4 text-slate-700 dark:text-gray-300 text-sm leading-relaxed">
              {tip.example}
            </div>
          </section>
        )}

        {(tip.pros?.length > 0 || tip.cons?.length > 0) && (
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tip.pros?.length > 0 && (
              <div className="rounded-lg border border-[#2ebd85] bg-[#edfaf4] dark:bg-[#0d2b1e] p-4">
                <h4 className="font-bold text-[#2ebd85] text-sm mb-2">Advantages</h4>
                <ul className="space-y-1.5">
                  {tip.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-gray-300">
                      <span className="text-[#2ebd85] mt-0.5">✓</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tip.cons?.length > 0 && (
              <div className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 p-4">
                <h4 className="font-bold text-rose-600 text-sm mb-2">Considerations</h4>
                <ul className="space-y-1.5">
                  {tip.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-gray-300">
                      <span className="text-rose-500 mt-0.5">✕</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {tip.bottomNote && (
          <section className="rounded-lg border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 px-5 py-4 flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <p className="text-sm text-yellow-800 dark:text-yellow-300 leading-relaxed">{tip.bottomNote}</p>
          </section>
        )}
      </div>
    </div>
  );
}

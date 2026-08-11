// src/components/sections/ContributionGraph.jsx
import { useMemo } from 'react';
import SectionHead from '../ui/SectionHead.jsx';

export default function ContributionGraph() {
  // Generate a mock contribution graph that looks extremely active (top 1% globally)
  const weeks = 52;
  const daysPerWeek = 7;
  
  const grid = useMemo(() => {
    const data = [];
    for (let w = 0; w < weeks; w++) {
      const week = [];
      for (let d = 0; d < daysPerWeek; d++) {
        // High density activity
        let level = 0;
        const rand = Math.random();
        if (rand > 0.85) level = 4;
        else if (rand > 0.6) level = 3;
        else if (rand > 0.3) level = 2;
        else if (rand > 0.1) level = 1;
        
        week.push(level);
      }
      data.push(week);
    }
    return data;
  }, []);

  return (
    <section className="section fade-up">
      <SectionHead
        tag="Activity Metrics"
        title="12,787 Commits in the Last Year"
        sub="Continuous integration and relentless open-source contribution velocity."
      />
      
      <div className="contrib-wrapper">
        <div className="contrib-scroll">
          <div className="contrib-grid">
            {grid.map((week, i) => (
              <div key={i} className="contrib-col">
                {week.map((level, j) => (
                  <div key={j} className={`contrib-cell lvl-${level}`} />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="contrib-legend">
          <span>Less</span>
          <div className="contrib-cell lvl-0" />
          <div className="contrib-cell lvl-1" />
          <div className="contrib-cell lvl-2" />
          <div className="contrib-cell lvl-3" />
          <div className="contrib-cell lvl-4" />
          <span>More</span>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="container-max py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl leading-tight mb-6">Standards for the Global AI Economy</h1>
            <p className="prose-text mb-8">
              GIAS provides institutional governance, standards, and certification frameworks for AI systems operating across borders. Our five-pillar methodology ensures alignment, robustness, data governance, explainability, and operational risk mitigation.
            </p>
            <div className="flex gap-4">
              <a href="/standards" className="btn-primary inline-block">Explore Standards</a>
              <a href="/governance" className="btn-secondary inline-block">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      {/* Five Pillars */}
      <section className="bg-neutral-50 py-24">
        <div className="container-max">
          <h2 className="text-4xl mb-16">The Five Pillars of GIAS</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { title: 'Alignment', desc: 'Goal congruence with human values' },
              { title: 'Robustness', desc: 'Adversarial and edge-case resilience' },
              { title: 'Data Governance', desc: 'Privacy, provenance, and licensing' },
              { title: 'Explainability', desc: 'Interpretable decision pathways' },
              { title: 'Operational Risk', desc: 'Lifecycle management & auditing' },
            ].map((pillar, i) => (
              <div key={i} className="card-panel">
                <h3 className="text-xl mb-3">{pillar.title}</h3>
                <p className="text-sm text-slate-600">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container-max text-center">
          <h2 className="text-4xl mb-6 font-serif">Ready to Certify?</h2>
          <p className="prose-text text-slate-300 mb-8">
            Join leading enterprises in building AI systems that meet global standards.
          </p>
          <a href="https://portal.gias.institute" className="bg-white text-slate-900 px-8 py-3 font-medium hover:bg-slate-100 transition inline-block">
            Access Portal
          </a>
        </div>
      </section>
    </main>
  )
}

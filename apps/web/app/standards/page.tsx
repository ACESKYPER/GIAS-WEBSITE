export default function StandardsPage() {
  const standards = [
    { id: 'mif', title: 'Model Interoperability Framework (MIF)', version: '1.0.0', released: '2025-01-15', description: 'Defines interfaces and protocols for AI model deployment across heterogeneous platforms.', status: 'Active' },
    { id: 'dsp', title: 'Data Stewardship Protocol (DSP)', version: '1.0.0', released: '2025-02-01', description: 'Establishes data provenance, licensing, and governance requirements.', status: 'Active' },
    { id: 'tl', title: 'Transparency & Labeling (TL)', version: '0.9.0', released: '2025-01-20', description: 'Standards for model cards, system documentation, and capability disclosure.', status: 'Proposed' },
  ]

  return (
    <div>
      <section className="bg-white border-b border-slate-200">
          <div className="container-max py-16">
            <h1 className="text-4xl md:text-5xl mb-4">GIAS Standards</h1>
            <p className="text-slate-600 max-w-3xl">Institutional standards for AI interoperability, governance, and certification.</p>
          </div>
        </section>

        <section className="container-max py-12">
          <div className="grid gap-6">
            {standards.map((std) => (
              <div key={std.id} className="block p-6 bg-white border rounded hover:shadow cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-serif mb-1">{std.title}</h3>
                    <p className="text-sm text-slate-600">Version {std.version} • Released {std.released}</p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${std.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {std.status}
                  </span>
                </div>
                <p className="text-slate-600 mt-4">{std.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container-max py-12">
          <div className="card-panel p-6 bg-neutral-50 border rounded">
            <h2 className="text-2xl mb-2">Changelog & Versioning</h2>
            <p className="text-slate-600">This repository follows semantic versioning for standards releases. See the changelog for details.</p>
            <a href="#changelog" className="text-blue-700 hover:text-blue-800 font-medium mt-4 inline-block">View Changelog →</a>
          </div>
        </section>
      </div>
    )
  }

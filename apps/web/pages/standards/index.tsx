import { GetStaticProps } from 'next';
import Link from 'next/link';
import { listStandards, StandardMeta } from '../../lib/standards';

export const getStaticProps: GetStaticProps = async () => {
  const standards = listStandards();
  return { props: { standards } };
};

import Head from 'next/head';

export default function StandardsIndex({ standards }: { standards: StandardMeta[] }) {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <Head>
        <title>Standards – GIAS</title>
        <meta name="description" content="GIAS official standards and stewardship documents." />
      </Head>
      <h1 className="text-3xl font-bold mb-4">GIAS Standards</h1>
      <p className="text-sm text-gray-600 mb-6">Official GIAS standards and stewardship documents.</p>
      <ul className="space-y-3">
        {standards.map((s) => (
          <li key={s.id} className="p-4 border rounded">
            <div className="flex justify-between items-center">
              <Link href={`/standards/${s.id}`} className="text-lg font-semibold text-blue-800">{s.id}</Link>
              <div className="text-sm text-gray-600">{s.issuing_body} • <strong>v{s.version}</strong></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

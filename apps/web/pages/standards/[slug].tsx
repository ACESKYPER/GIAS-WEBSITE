import { GetStaticPaths, GetStaticProps } from 'next';
import { listStandards, getStandard } from '../../lib/standards';
import MetadataBanner from '../../components/MetadataBanner';
import TOC from '../../components/TOC';
import PDFDownloadButton from '../../components/PDFDownloadButton';
import CommentSection from '../../components/CommentSection';

export const getStaticPaths: GetStaticPaths = async () => {
  const standards = listStandards();
  return { paths: standards.map((s) => ({ params: { slug: s.id } })), fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = String(params?.slug);
  const s = await getStandard(slug);
  return { props: { meta: s.meta, content: s.content, id: slug } };
};

export default function StandardPage({ meta, content, id }: any) {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <MetadataBanner meta={meta} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <main className="lg:col-span-3">
          {meta.status === 'Draft' && <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-300">This document is a draft.</div>}
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
          <div className="mt-6 flex justify-between items-center">
            <PDFDownloadButton id={id} />
            <a href="/standards/GIAS-PUBLIC-STANDARDS-REGISTER" className="text-sm text-blue-700 hover:underline">Public Standards Register</a>
          </div>
          <CommentSection id={id} />
        </main>
        <aside className="lg:col-span-1">
          <TOC html={content} />
        </aside>
      </div>
    </div>
  );
}

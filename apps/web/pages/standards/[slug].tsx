import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  return { props: { meta: s.meta, content: s.content, headings: s.headings, id: slug } };
};

export default function StandardPage({ meta, content, headings, id }: any) {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <Head>
        <title>{meta.title || id} – GIAS</title>
        {meta.description && <meta name="description" content={meta.description} />}
      </Head>
      <MetadataBanner meta={meta} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <main className="lg:col-span-3">
          {meta.status === 'Draft' && <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-300">This document is a draft.</div>}
          <article className="prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => {
                  const text = String(props.children).replace(/<[^>]+>/g, '');
                  const id = text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  return <h1 id={id} {...props} />;
                },
                h2: ({ node, ...props }) => {
                  const text = String(props.children).replace(/<[^>]+>/g, '');
                  const id = text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  return <h2 id={id} {...props} />;
                },
                h3: ({ node, ...props }) => {
                  const text = String(props.children).replace(/<[^>]+>/g, '');
                  const id = text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  return <h3 id={id} {...props} />;
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
          <div className="mt-6 flex justify-between items-center">
            <PDFDownloadButton id={id} />
            <a href="/standards/GIAS-PUBLIC-STANDARDS-REGISTER" className="text-sm text-blue-700 hover:underline">Public Standards Register</a>
          </div>
          <CommentSection id={id} />
        </main>
        <aside className="lg:col-span-1">
          <TOC headings={headings || []} />
        </aside>
      </div>
    </div>
  );
}

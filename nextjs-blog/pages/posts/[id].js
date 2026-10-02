import Layout from './../components/layout';
import { getAllPostIds, getPostData } from '../../lib/posts-firebase';
//import { getAllPostIds, getPostData } from '../../lib/posts-json';
//import { getAllPostIds, getPostData } from '../../lib/posts';

import Head from 'next/head';
import Date from '../components/date';
import utilStyles from '../utils.module.css';

export default function Post({ postData }) {
  return (
    <Layout>
      {postData.title}
      <br />
      {postData.date}
      
      <br />
      {postData.contentHtml}
      <br />

    </Layout>
  );
}

export async function getStaticPaths() { // await is used since we are not pulling json or md data
  const paths = await getAllPostIds();
  // const paths = getAllPostIds(); gets md posts
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) { // await is used since we are not pulling json or md data
  const postData = await getPostData(params.id);
  console.log(postData);
  return {
    props: {
      postData,
    },
  };
}
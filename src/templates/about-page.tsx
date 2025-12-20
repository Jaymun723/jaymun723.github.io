import * as React from "react"
import { graphql, PageProps } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

interface AboutPageData {
  site: {
    siteMetadata: {
      title: string
    }
  }
  markdownRemark: {
    html: string
    excerpt: string
    frontmatter: {
      title: string
      description?: string
    }
  }
}

const AboutPageTemplate: React.FC<PageProps<AboutPageData>> = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <article
        className="blog-post bento-card"
        itemScope
        itemType="http://schema.org/Article"
        style={{ padding: 'var(--spacing-8)' }}
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
      </article>
    </Layout>
  )
}

export const Head: React.FC<PageProps<AboutPageData>> = ({ data, location }) => {
  const post = data.markdownRemark
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
      pathname={location.pathname}
    />
  )
}

export default AboutPageTemplate

export const pageQuery = graphql`
  query AboutPageBySlug($id: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        description
      }
    }
  }
`

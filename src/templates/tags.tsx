import * as React from "react"
import { Link, graphql, PageProps } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

interface TagsPageContext {
  tag: string
}

interface TagsQueryData {
  site: {
    siteMetadata: {
      title: string
    }
  }
  allMarkdownRemark: {
    totalCount: number
    edges: {
      node: {
        fields: {
          slug: string
        }
        frontmatter: {
          title: string
          date: string
        }
      }
    }[]
  }
}

const Tags: React.FC<PageProps<TagsQueryData, TagsPageContext>> = ({ pageContext, data, location }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`

  const tagHeader = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } tagged with "${tag}"`

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title={`Tags - ${tag}`} />
      <div className="global-wrapper">
        <h1 className="main-heading">{tagHeader}</h1>
        <ul style={{ listStyle: `none`, padding: 0 }}>
          {edges.map(({ node }) => {
            const { slug } = node.fields
            const { title } = node.frontmatter
            return (
              <li key={slug} className="post-list-item" style={{ marginBottom: 'var(--spacing-4)' }}>
                <Link to={slug} className="bento-card" style={{ display: 'block', textDecoration: 'none', color: 'var(--color-text)' }}>
                  <h2 style={{ marginTop: 0, marginBottom: 'var(--spacing-2)' }}>{title}</h2>
                  <small>{node.frontmatter.date}</small>
                </Link>
              </li>
            )
          })}
        </ul>
        <div style={{ marginTop: 'var(--spacing-8)' }}>
          <Link to="/tags">All tags</Link>
        </div>
      </div>
    </Layout>
  )
}

export default Tags

export const pageQuery = graphql`
  query($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { frontmatter: { date: DESC } }
      filter: {
        frontmatter: { tags: { in: [$tag] } }
        fields: { collection: { eq: "blog" } }
      }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`

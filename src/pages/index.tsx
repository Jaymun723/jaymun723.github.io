import * as React from "react"
import { Link, graphql, PageProps } from "gatsby"
import { GatsbyImage, getImage, IGatsbyImageData } from "gatsby-plugin-image"
import kebabCase from "lodash/kebabCase"
import { FaTag } from "react-icons/fa"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

interface BlogPostNode {
  excerpt: string
  fields: {
    slug: string
  }
  frontmatter: {
    date: string
    title: string
    description: string
    tags: string[]
    featuredImage: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
    }
  }
}

interface BlogIndexData {
  site: {
    siteMetadata: {
      title: string
    }
  }
  allMarkdownRemark: {
    nodes: BlogPostNode[]
  }
}

const BlogIndex: React.FC<PageProps<BlogIndexData>> = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Bio />
        <p>
          No blog posts found.
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <ol className="bento-grid" style={{ listStyle: `none`, padding: 0 }}>
        <li>
          <article className="post-list-item bento-card" itemScope itemType="http://schema.org/Person">
            <header>
              <h2 style={{ marginTop: 0 }}>
                <Link to="/about">About Me</Link>
              </h2>
            </header>
            <section>
              <Bio />
            </section>
          </article>
        </li>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug
          const featuredImage = getImage(post.frontmatter.featuredImage)
          const tags = post.frontmatter.tags

          return (
            <li key={post.fields.slug}>
              <article
                className="post-list-item bento-card"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={post.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter.date}</small>
                  {tags && tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {tags.map(tag => (
                        <Link
                          key={tag}
                          to={`/tags/${kebabCase(tag)}/`}
                          style={{
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            color: 'var(--color-text-light)',
                            textDecoration: 'none'
                          }}
                        >
                          <FaTag size={10} />
                          {tag}
                        </Link>
                      ))}
                    </div>
                  )}
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: post.frontmatter.description || post.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
                {featuredImage && (
                  <div style={{ marginTop: 'var(--spacing-4)' }}>
                    <GatsbyImage image={featuredImage} alt={title} style={{ borderRadius: '8px' }} />
                  </div>
                )}
              </article>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head: React.FC = () => <Seo title="All posts" />

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          tags
          featuredImage {
            childImageSharp {
              gatsbyImageData(width: 600)
            }
          }
        }
      }
    }
  }
`

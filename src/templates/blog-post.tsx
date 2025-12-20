import * as React from "react"
import { Link, graphql, PageProps } from "gatsby"
import { FaArrowLeft, FaArrowRight, FaTag, FaShareAlt, FaCheck } from "react-icons/fa"
import { IGatsbyImageData } from "gatsby-plugin-image"
import kebabCase from "lodash/kebabCase"
import Comments from "../components/comments"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

interface ShareButtonProps {
  title: string
  url: string
}

const ShareButton: React.FC<ShareButtonProps> = ({ title, url }) => {
  const [copied, setCopied] = React.useState(false)

  const handleShare = async () => {
    const shareData = {
      title: title,
      text: `Check out this post: ${title}`,
      url: url,
    }

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  return (
    <button
      onClick={handleShare}
      aria-label="Share this post"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--color-text-light)',
        padding: '0.5rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '1rem',
        transition: 'color 0.2s',
        verticalAlign: 'middle',
        marginLeft: '1rem'
      }}
      className="share-button"
    >
      {copied ? <FaCheck color="green" /> : <FaShareAlt />}
    </button>
  )
}

interface BlogPostBySlugData {
  site: {
    siteMetadata: {
      title: string
    }
  }
  markdownRemark: {
    id: string
    excerpt: string
    html: string
    tableOfContents: string
    fields: {
      slug: string
    }
    frontmatter: {
      title: string
      date: string
      description: string
      tags: string[]
      featuredImage: {
        childImageSharp: {
          gatsbyImageData: IGatsbyImageData
        }
        publicURL: string
      }
    }
  }
  previous: {
    fields: {
      slug: string
    }
    frontmatter: {
      title: string
    }
  } | null
  next: {
    fields: {
      slug: string
    }
    frontmatter: {
      title: string
    }
  } | null
}

const BlogPostTemplate: React.FC<PageProps<BlogPostBySlugData>> = ({
  data: { previous, next, site, markdownRemark: post },
  location,
}) => {
  const siteTitle = site.siteMetadata?.title || `Title`
  const tags = post.frontmatter.tags
  const postUrl = typeof window !== 'undefined' ? window.location.href : ''
  const cusdisAppId = '2406709e-c463-4b14-9d0f-c31e598ec5b2'

  const prettySlug = post.fields.slug.replace("/", "")

  return (
    <Layout location={location} title={siteTitle}>
      <div className="blog-post-grid">
        <article
          className="blog-post bento-card"
          itemScope
          itemType="http://schema.org/Article"
        >
          <header>
            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '1rem' }}>
              <h1 id={prettySlug} itemProp="headline" style={{ marginTop: 'var(--spacing-0)', marginBottom: 'var(--spacing-4)' }}>
                {post.frontmatter.title}
              </h1>
              <div style={{ marginTop: '0.2rem' }}>
                <ShareButton title={post.frontmatter.title} url={postUrl} />
              </div>
            </div>
            <p>{post.frontmatter.date}</p>
            {tags && tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: 'var(--spacing-4)' }}>
                {tags.map(tag => (
                  <Link
                    key={tag}
                    to={`/tags/${kebabCase(tag)}/`}
                    style={{
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      background: 'var(--color-accent)',
                      color: 'var(--color-text)',
                      textDecoration: 'none'
                    }}
                  >
                    <FaTag size={12} />
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </header>
          {/* {featuredImage && (
            <div style={{ marginBottom: 'var(--spacing-8)' }}>
              <GatsbyImage image={featuredImage} alt={post.frontmatter.title} style={{ borderRadius: '8px' }} />
            </div>
          )} */}
          <section
            dangerouslySetInnerHTML={{ __html: post.html }}
            itemProp="articleBody"
          />
          <hr />
        </article>

        <aside className="blog-post-sidebar">
          {post.tableOfContents && (
            <div className="toc-card bento-card" style={{ marginBottom: 'var(--spacing-6)' }}>
              <h2 style={{ marginTop: 0, fontSize: '1.2rem', marginBottom: 'var(--spacing-4)', flexShrink: 0 }}>Table of Contents</h2>
              <div className="toc-content">
                <ul>
                  <li>
                    <a href={`#${prettySlug}`}>
                      {post.frontmatter.title}
                    </a>
                  </li>
                </ul>
                <div
                  dangerouslySetInnerHTML={{ __html: post.tableOfContents }}
                />
              </div>
            </div>
          )}
          <div className="bento-card">
            <h2 style={{ marginTop: 0 }}>
              <Link to="/about">About me</Link>
            </h2>
            <Bio />
          </div>
        </aside>
      </div>

      <nav className="blog-post-nav" style={{ marginTop: 'var(--spacing-8)' }}>
        <ul
          style={{
            display: `grid`,
            gridTemplateColumns: previous && next ? `repeat(auto-fit, minmax(300px, 1fr))` : `1fr 1fr`,
            gap: `var(--spacing-4)`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          {previous ? (
            <li style={{ display: 'flex' }}>
              <Link to={previous.fields.slug} rel="prev" className="bento-card" style={{ width: '100%', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--color-text)' }}>
                <FaArrowLeft size={24} style={{ color: 'var(--color-primary)' }} />
                <div style={{ flex: 1 }}>
                  <small style={{ textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--color-text-light)' }}>Previous</small>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{previous.frontmatter.title}</div>
                </div>
              </Link>
            </li>
          ) : <div />}
          {next ? (
            <li style={{ display: 'flex' }}>
              <Link to={next.fields.slug} rel="next" className="bento-card" style={{ width: '100%', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between', textAlign: 'right', color: 'var(--color-text)' }}>
                <div style={{ flex: 1 }}>
                  <small style={{ textTransform: 'uppercase', fontWeight: 'bold', color: 'var(--color-text-light)' }}>Next</small>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{next.frontmatter.title}</div>
                </div>
                <FaArrowRight size={24} style={{ color: 'var(--color-primary)' }} />
              </Link>
            </li>
          ) : <div />}
        </ul>
      </nav>

      <section className="comments-section bento-card" style={{ marginTop: 'var(--spacing-8)', marginBottom: 'var(--spacing-8)' }}>
        <Comments appId={cusdisAppId} pageId={post.fields.slug} />
      </section>
    </Layout>
  )
}


export const Head: React.FC<PageProps<BlogPostBySlugData>> = ({ data: { markdownRemark: post } }) => {
  return (
    <Seo
      title={post.frontmatter.title}
      description={post.frontmatter.description || post.excerpt}
      image={post.frontmatter.featuredImage?.publicURL}
      keywords={post.frontmatter.tags}
    />
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      tableOfContents(maxDepth: 3)
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        tags
        featuredImage {
          childImageSharp {
            gatsbyImageData(width: 800)
          }
          publicURL
        }
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`

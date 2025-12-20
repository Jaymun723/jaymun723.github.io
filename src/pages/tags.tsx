import * as React from "react"
import { Link, graphql, PageProps } from "gatsby"
import kebabCase from "lodash/kebabCase"
import Layout from "../components/layout"
import Seo from "../components/seo"

interface TagsPageData {
  site: {
    siteMetadata: {
      title: string
    }
  }
  allMarkdownRemark: {
    group: {
      fieldValue: string
      totalCount: number
    }[]
  }
}

const TagsPage: React.FC<PageProps<TagsPageData>> = ({
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title },
    },
  },
  location,
}) => {
  return (
    <Layout location={location} title={title}>
      <div className="global-wrapper">
        <h1 className="main-heading">Tags</h1>
        <ul style={{ listStyle: `none`, padding: 0, display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {group.map(tag => (
            <li key={tag.fieldValue}>
              <Link to={`/tags/${kebabCase(tag.fieldValue)}/`} className="bento-card" style={{ display: 'block', textDecoration: 'none', color: 'var(--color-text)', padding: '0.5rem 1rem' }}>
                {tag.fieldValue} ({tag.totalCount})
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}

export default TagsPage

export const Head: React.FC<PageProps> = ({ location }) => (
  <Seo title="All Tags" pathname={location.pathname} />
)

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      filter: { fields: { collection: { eq: "blog" } } }
    ) {
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`

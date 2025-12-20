import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const AboutPage = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const authorName = data.site.siteMetadata.author.name

  return (
    <Layout location={location} title={siteTitle}>
      <h1>About Me</h1>
      <p>
        Hello! I'm {authorName}. This is my personal blog where I share my thoughts and experiences.
      </p>
      <p>
        I enjoy building things and learning new technologies. Thanks for stopping by!
      </p>
    </Layout>
  )
}

export const Head = () => <Seo title="About Me" />

export default AboutPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        author {
          name
        }
      }
    }
  }
`

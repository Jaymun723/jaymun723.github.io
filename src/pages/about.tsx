import * as React from "react"
import { graphql, PageProps } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

interface AboutPageData {
  site: {
    siteMetadata: {
      title: string
      author: {
        name: string
      }
    }
  }
}

const AboutPage: React.FC<PageProps<AboutPageData>> = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title
  const authorName = data.site.siteMetadata.author.name

  return (
    <Layout location={location} title={siteTitle}>
      <h1>About Me</h1>
      <p>
        I am a computational quantum physics student at <a href="https://polytechnique.edu/">Polytechnique</a> (France).
      </p>
      <p>
        My goal is to study computational methods to improve the understanding of quantum matter. I am also interested by quantum computers, and espcially how they related to computational physics.
      </p>
      <h2>Education</h2>
      <h3><span style={{ textDecoration: "underline" }}>École polytechnique</span>, MSc in Engineering</h3>
    </Layout>
  )
}

export const Head: React.FC = () => <Seo title="About Me" />

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

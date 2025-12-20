/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { FaGithub, FaLinkedin } from "react-icons/fa"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            github
            linkedin
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

  return (
    <div className="bio">
      {author?.name && (
        <div>
          <p style={{ marginBottom: '1rem' }}>
            Written by <strong>{author.name}</strong> {author?.summary || null}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '1.5rem' }}>
            {social?.github && (
              <a href={`https://github.com/${social.github}`} aria-label="GitHub" style={{ color: 'inherit' }}>
                <FaGithub />
              </a>
            )}
            {social?.linkedin && (
              <a href={`https://linkedin.com/in/${social.linkedin}`} aria-label="LinkedIn" style={{ color: 'inherit' }}>
                <FaLinkedin />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Bio

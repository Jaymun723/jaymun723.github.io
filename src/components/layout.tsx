import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { FaGithub, FaLinkedin } from "react-icons/fa"
import ThemeToggler from "./theme-toggler"
import CodeBlockManager from "./code-copy-button"

declare const __PATH_PREFIX__: string;

interface LayoutProps {
  location: {
    pathname: string
  }
  title: string
  children: React.ReactNode
}

interface LayoutQueryData {
  site: {
    siteMetadata: {
      author: {
        name: string
      }
      social: {
        github: string
        linkedin: string
      }
    }
  }
}

const Layout: React.FC<LayoutProps> = ({ location, title, children }) => {
  const data = useStaticQuery<LayoutQueryData>(graphql`
    query LayoutQuery {
      site {
        siteMetadata {
          author {
            name
          }
          social {
            github
            linkedin
          }
        }
      }
    }
  `)

  const social = data.site.siteMetadata?.social
  const name = data.site.siteMetadata.author.name
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  const header = (
    <h1 className="main-heading">
      <Link to="/">{title}</Link>
    </h1>
  )

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <CodeBlockManager key={location.pathname} />
      <header className="global-header">
        <div className="header-container">
          {header}
          <div className="header-nav">
            <ThemeToggler />
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="bento-card" style={{ marginTop: 'var(--spacing-16)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          © {new Date().getFullYear()} {title} - {name}
        </div>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '1.2rem' }}>
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
      </footer>
    </div>
  )
}

export default Layout

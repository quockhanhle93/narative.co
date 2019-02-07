import React, { Component } from 'react'

import { Link } from 'gatsby'
import styled, { css } from 'styled-components'

import Heading from '@components/Heading'
import Helmet from '@components/Helmet'
import Layout from '@components/Layout'
import { MicrodataBreadcrumb, RichText } from '@components/Media'
import withDarkMode from '@components/DarkMode'
import Img from '@components/Media/Media.Img'
import Section from '@components/Section'

import mediaqueries from '@styles/media'

import { IDetailPage, IArticleNode } from '@typings'

interface PostState {
  previousPath: string
}

class Article extends Component<IDetailPage, PostState> {
  article = this.props.pageContext.article
  relateds = this.props.pageContext.relateds

  state = {
    previousPath: '/',
  }

  get readingTime() {
    this.article.fields.readingTime.minutes
  }

  render = () => {
    const { location, ...props } = this.props
    const article = this.article
    const author = this.article.author

    return (
      <Layout navTheme="dark" navOffset={false}>
        <Hero>
          <HeroContent>
            <Header>
              <HeroTitle>{article.title}</HeroTitle>
              <HeroSubtitle>
                By {author.name} – {author.title}
              </HeroSubtitle>
            </Header>
          </HeroContent>
          <RelativeSection>
            <ReadingTime>{article.fields.readingTime.text}</ReadingTime>
          </RelativeSection>
        </Hero>
        <DarkModeButton onClick={this.props.toggleMode}>
          Dark/Light
        </DarkModeButton>
        <Content content={article.body} />
      </Layout>
    )
  }
}

export default withDarkMode(Article)

const DarkModeButton = styled.div`
  position: fixed;
  top: 150px;
  right: 150px;
  z-index: 3;
  color: #000;
`
const Content = styled(RichText).attrs<{ textHighlightColor: string }>({})`
  position: relative;
  padding: 160px 0 130px;
  z-index: 2;
  background: ${p => p.theme.mode.gradient};
  transition: background 0.3s ease;
`

const Hero = styled.div`
  position: relative;
  z-index: 1;
  min-height: 720px;
  height: 100vh;
  width: 100vw;
  background: #d9dbe0;
  display: flex;
`

const HeroContent = styled.div`
  position: absolute;
  height: 100%;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`

const Header = styled.header`
  max-width: 680px;
  margin: 0 auto;
`

const HeroTitle = styled(Heading.h1)`
  font-size: 48px;
  color: #000;
  font-family: ${p => p.theme.fontfamily.serif};
  font-weight: 700;
`

const HeroSubtitle = styled.div`
  font-size: 18px;
  color: #000;
  opacity: 0.25;
  font-weight: 800;
`

const RelativeSection = styled(Section)`
  position: relative;
  width: 100%;
`

const ReadingTime = styled.div`
  position: absolute;
  left: 0;
  bottom: 116px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.25);
  transform: rotate(90deg);

  &::after {
    content: '';
    position: absolute;
    height: 1px;
    top: 12px;
    width: 64px;
    right: -80px;
    background: #111216;
  }
`

const Microdata = ({
  article: { title, excerpt, author, hero, postDate },
  location,
  publicationLogo,
}: // sectionName,
// sectionUrl,
{
  article: IArticleNode
  location: Location
  publicationLogo: string
  // sectionName: string
  // sectionUrl: string
}) => {
  let isoDateStr
  try {
    isoDateStr = new Date(postDate!).toISOString()
  } catch (error) {
    // Now all browsers can parse our date string. That's fine. The crawler can
    console.log(error)
  }

  return (
    <>
      <MicrodataBreadcrumb
        levels={[
          {
            // name: sectionName,
            // item: sectionUrl,
          },
          { name: title, item: location.href },
        ]}
      />
      <Helmet
        title={title}
        description={excerpt}
        image={hero.Article__Hero.src}
      >
        <script type="application/ld+json">
          {`
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "${location.href}"
            },
            "headline": "${title}",
            "image": "${hero.Article__Hero.src}",
            "datePublished": "${isoDateStr}",
            "dateModified": "${isoDateStr}",
            "author": {
              "@type": "Person",
              "name": "${author ? author.name : 'Hopper Editors'}"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Hopper",
              "logo": {
                "@type": "ImageObject",
                "url": "${location.origin + publicationLogo}"
              }
            },
            "description": "${excerpt}"
          }
        `}
        </script>
      </Helmet>
    </>
  )
}

import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'

import {
  Stack,
  Image,
  Form,
  Button,
  Card,
  Spinner,
  Toast,
  ToastContainer,
} from 'react-bootstrap'

import { Typeahead, Highlighter } from 'react-bootstrap-typeahead' // ES2015

import Header from 'components/Header'
import GuessList from 'components/GuessList'
import InfoModal from 'components/InfoModal'
import StatsModal from 'components/StatsModal'
import Countdown from 'components/Countdown'

import { useLocalStorage } from 'components/useLocalStorage'

import NoSSRWrapper from 'components/no-ssr-wrapper'

import * as Icon from 'react-bootstrap-icons'

const attemptLength = [1, 2, 3, 4, 8, 16]

const STATUS_PENDING = 'PENDING'
const STATUS_SOLVED = 'SOLVED'
const STATUS_FAILED = 'FAILED'

const NewGameState = {
  gameNumber: -1,
  guesses: [],
  status: STATUS_PENDING,
}

const props = {}

const Home = (props) => {
  let [playing, setPlaying] = useState(false)

  const [gameState, setGameState] = useLocalStorage('gameState', NewGameState)

  //const [guesses, setGuesses] = useState([])
  //const [guesses, setGuesses] = useLocalStorage('guesses', [])
  const [stats, setStats] = useLocalStorage('stats', [0, 0, 0, 0, 0, 0, 0])
  const [currentStreak, setCurrentStreak] = useLocalStorage('currentStreak', 0)
  const [maxStreak, setMaxStreak] = useLocalStorage('maxStreak', 0)

  let [selected, setSelected] = useState([])
  let [playerReady, setPlayerReady] = useState(false)

  let [showInfo, setShowInfo] = useState(false)
  let [showStats, setShowStats] = useState(false)

  let [answer, setAnswer] = useState(() => {
    let animes = props.animes

    let randomAnime = animes[Math.floor(Math.random() * animes.length)]

    function getDateDifference(e, a) {
      var s = new Date(e),
        t = new Date(a).setHours(0, 0, 0, 0) - s.setHours(0, 0, 0, 0)
      return Math.floor(t / 864e5)
    }

    var baseDate = new Date(2015, 9, 20, 0, 0, 0, 0)

    var today = new Date()
    today.setDate(today.getDate())
    //let daysSince = Math.floor(today.getMinutes() / 2)
    let daysSince = getDateDifference(baseDate, today)
    let aotdIndex = daysSince % animes.length
    //let aotd = animes[aotdIndex]
    let aotd = randomAnime

    var releaseDate = new Date(2022, 3, 15, 0, 0, 0, 0)
    //let gameNumber = Math.floor(today.getMinutes() / 2)
    let gameNumber = getDateDifference(releaseDate, today)

    return {
      gameNumber,
      ...aotd,
    }
  })

  const [toastStatus, setToastStatus] = useState({
    text: '',
    show: false,
    bg: 'Primary',
  })

  useEffect(() => {
    if (true || answer.gameNumber != gameState.gameNumber) {
      //reset game
      setGameState({ ...NewGameState, gameNumber: answer.gameNumber })
    }
    if (
      answer.gameNumber - gameState.gameNumber > 1 ||
      gameState.status !== STATUS_SOLVED
    ) {
      setCurrentStreak(0)
    }
  }, [answer.gameNumber])

  let handleGuess = (guess) => {
    if (!guess) return

    let newGuesses = [...gameState.guesses, guess]
    let status = gameState.status

    if (guess.romaji === answer.title.romaji) {
      //solved
      let newStats = [...stats]
      newStats[gameState.guesses.length]++
      setStats(newStats)
      setCurrentStreak(currentStreak + 1)
      setMaxStreak(Math.max(currentStreak + 1, maxStreak))
      status = STATUS_SOLVED
      setToastStatus({
        text: 'VoHiYo',
        show: true,
        bg: 'success',
      })
    } else if (newGuesses.length === attemptLength.length) {
      //failed
      let newStats = [...stats]
      newStats[6]++
      setStats(newStats)
      setCurrentStreak(0)
      status = STATUS_FAILED
      setToastStatus({
        text: 'Weebs Out',
        show: true,
        bg: 'danger',
      })
    }
    setGameState({ ...gameState, guesses: newGuesses, status: status })
    setSelected([])
  }

  return (
    <NoSSRWrapper>
      <div>
        <style global jsx>{`
          html,
          body,
          body > div:first-child,
          div#__next,
          div#__next > div {
            height: 100%;
          }
        `}</style>

        <Head>
          <title>Aniguess {answer.gameNumber}</title>
        </Head>

        <main className={[styles.fill, 'container-md'].join(' ')}>
          <Stack gap={2} className={styles.fill}>
            <Header
              onClickInfo={() => setShowInfo(true)}
              onClickStats={() => setShowStats(true)}
            />
            <GuessList guesses={gameState.guesses} answer={answer.title} />
            <Card bg="secondary" className="p-2">
              <Stack direction="horizontal" gap={3}>
                {gameState.guesses.length >= 4 ? (
                  <Image
                    thumbnail
                    fluid
                    style={{ height: '12rem' }}
                    src={answer.coverImage.extraLarge}
                  />
                ) : (
                  <div
                    className="bg-dark"
                    style={{
                      height: '12rem',
                      width: '8rem',
                    }}
                  />
                )}
                <Stack gap={1}>
                  {gameState.status !== STATUS_PENDING && (
                    <h3>{answer.title.romaji}</h3>
                  )}
                  <h6>Genres:</h6>
                  {gameState.status !== STATUS_PENDING ||
                    (gameState.guesses.length >= 0 && (
                      <h6>{answer.genres.join(', ')}</h6>
                    ))}
                  <h6>Season: </h6>
                  {gameState.status !== STATUS_PENDING ||
                  gameState.guesses.length >= 1 ? (
                    <h6>
                      {answer.season} {answer.seasonYear}
                    </h6>
                  ) : (
                    <div className="bg-dark">&nbsp;</div>
                  )}
                  <h6>Studio:</h6>
                  {gameState.status !== STATUS_PENDING ||
                  gameState.guesses.length >= 2 ? (
                    <h6>{answer.studios.edges[0].node.name}</h6>
                  ) : (
                    <div className="bg-dark">&nbsp;</div>
                  )}
                  <h6>Character:</h6>
                  {gameState.status !== STATUS_PENDING ||
                  gameState.guesses.length >= 3 ? (
                    <h6>{answer.characters.edges[0].node.name.full}</h6>
                  ) : (
                    <div className="bg-dark">&nbsp;</div>
                  )}
                </Stack>
              </Stack>
              <h6>Synopsis:</h6>
              {gameState.status !== STATUS_PENDING ||
              gameState.guesses.length >= 5 ? (
                <h6>
                  {gameState.status !== STATUS_PENDING
                    ? answer.description
                    : answer.description.replace(/<i>(.|\n)*?<\/i>/, '_____')}
                </h6>
              ) : (
                <div className="bg-dark" style={{ height: '3rem' }}>
                  &nbsp;
                </div>
              )}
            </Card>
            {gameState.status === STATUS_PENDING && (
              <div className="bg-dark p-3">
                <Form>
                  <Form.Group className="mb-3" controlId="formGuess">
                    <Typeahead
                      id="guess"
                      labelKey={(title) => `${title.romaji} / ${title.english}`}
                      renderMenuItemChildren={(option, { text }, index) => (
                        <div>
                          <Highlighter search={text}>
                            {option.romaji}
                          </Highlighter>
                          <div>
                            <small>
                              <Highlighter search={text}>
                                {option.english}
                              </Highlighter>
                            </small>
                          </div>
                        </div>
                      )}
                      onChange={(selected) => {
                        setSelected(selected)
                      }}
                      maxResults={5}
                      paginate={false}
                      options={
                        props.titleList.filter((title) => {
                          return !gameState.guesses
                            .map((title) => title.romaji)
                            .includes(title.romaji)
                        }) || []
                      }
                      placeholder="Guess"
                      minLength={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleGuess(selected[0])
                        }
                      }}
                      selected={selected}
                      dropup={true}
                    />
                  </Form.Group>
                </Form>

                <Stack direction="horizontal" gap={3}>
                  {gameState.status === STATUS_PENDING && (
                    <Button
                      variant="secondary"
                      onClick={() => handleGuess('Skipped')}
                    >
                      {gameState.guesses.length < attemptLength.length - 1
                        ? 'Skip'
                        : 'Give Up'}
                    </Button>
                  )}

                  {gameState.status === STATUS_PENDING && (
                    <Button
                      variant="success"
                      onClick={() => handleGuess(selected[0])}
                    >
                      Submit
                    </Button>
                  )}
                </Stack>
              </div>
            )}

            {gameState.status !== STATUS_PENDING && (
              <>
                <Card bg="secondary" className="p-2">
                  <Stack
                    direction="horizontal"
                    gap={3}
                    className="justify-content-around"
                  >
                    <Countdown />
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => {
                        let shareText = `Aniguess ${gameState.gameNumber}\n\n`
                        //if (gameState.status === STATUS_SOLVED)
                        //shareText += '🔊'
                        //else shareText += '🔇'
                        for (let i = 0; i < 6; i++) {
                          let guess = gameState.guesses[i]
                          if (!guess) shareText += '⬜'
                          else if (guess === 'Skipped') shareText += '⬛'
                          else if (guess === answer.title) shareText += '🟩'
                          else shareText += '🟥'
                        }
                        shareText += '\nhttps://aniguess.bryanching.net/'
                        navigator.clipboard.writeText(shareText)
                        setToastStatus({
                          text: 'Copied to clipboard',
                          show: true,
                          bg: 'info',
                        })
                      }}
                    >
                      Share <Icon.Share />
                    </Button>
                  </Stack>
                </Card>
              </>
            )}
          </Stack>

          <InfoModal
            show={showInfo}
            onHide={() => {
              setShowInfo(false)
            }}
            centered
          />
          <StatsModal
            show={showStats}
            onHide={() => {
              setShowStats(false)
            }}
            centered
            stats={stats}
            currentStreak={currentStreak}
            maxStreak={maxStreak}
          />
          <ToastContainer className="p-3" position="middle-center">
            <Toast
              onClose={() => {
                setToastStatus({ show: false })
              }}
              show={toastStatus.show}
              delay={2000}
              autohide
              bg={toastStatus.bg}
            >
              <Toast.Body>{toastStatus.text}</Toast.Body>
            </Toast>
          </ToastContainer>
        </main>
      </div>
    </NoSSRWrapper>
  )
}

import fs from 'fs'
export async function getStaticProps(context) {
  let animes = JSON.parse(fs.readFileSync('animes.json'))
  return {
    props: {
      animes,
      titleList: animes.map((anime) => anime.title),
    },
  }
}

export default Home

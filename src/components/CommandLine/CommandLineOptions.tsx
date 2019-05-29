import React, { useState, ReactElement, useEffect, useRef } from 'react'
import Fuse from 'fuse.js'
import styled from 'styled-components'
import shortcuts from '../../shortcuts'

import { keyToSymbol } from '../../shortcuts/shortcuts'
import { GoToIcon, CreateIcon } from '../../icons/ui'
import { useActiveListItem } from '@utils'

function handleShortcutSelection(shortcut: { name: string }) {
  shortcuts.handleShortcutFeature(shortcut)
}

function calculateListOffset(activeCommand: number, results: any[]) {
  if (results.length > 3 && activeCommand === results.length - 1) {
    return (activeCommand - 3) * -64 - 10
  }

  if (results.length > 3 && activeCommand > 1) {
    return (activeCommand - 2) * -64
  }

  return 0
}

interface CommandProps {
  ideas?: any[]
}

function CommandLineOptions({ options = [] }: CommandProps) {
  const fuseOptions = {
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 20,
    minMatchCharLength: 2,
    keys: ['label'],
  }

  const list = [...options].filter(item => item.label)
  const fuse = new Fuse(list, fuseOptions)

  const [value, setValue] = useState('')
  const inputRef = useRef(null)
  const results = value ? fuse.search(value) : list
  const activeCommand = useActiveListItem(0, results)
  const offset = calculateListOffset(activeCommand, results)

  useEffect(() => {
    inputRef.current.focus()
  }, [inputRef])

  return (
    <>
      <Form
        onSubmit={event => {
          event.preventDefault()
          handleShortcutSelection(results[activeCommand])
        }}
      >
        <StyledInput
          ref={inputRef}
          type="text"
          placeholder="Type your command"
          value={value}
          onChange={event => {
            setValue(event.target.value)
          }}
        />
      </Form>
      <List>
        {results.map((shortcut: any, index) => {
          const highlight = index === activeCommand

          return (
            <Shortcut
              style={{ transform: `translateY(${offset}px)` }}
              key={shortcut.label + index}
              highlight={highlight}
              onClick={() => handleShortcutSelection(results[index])}
            >
              {labelToHighlighted(shortcut.label, highlight)}
              <ShortcutKeys>
                {shortcut.keys.map((key: any) => (
                  <div key={keyToSymbol(key)}>{keyToSymbol(key)}</div>
                ))}
              </ShortcutKeys>
            </Shortcut>
          )
        })}
      </List>
    </>
  )
}

export default CommandLineOptions

const labelToHighlighted = (
  label: string,
  highlight?: boolean
): ReactElement => {
  const shortcutActionDefinitions = [
    { key: 'Contact', Icon: CreateIcon },
    { key: 'Close', Icon: GoToIcon },
    { key: 'Go to', Icon: GoToIcon },
  ]

  const fallback = { key: 'Fallback', Icon: GoToIcon }

  const { key, Icon } =
    shortcutActionDefinitions.find(({ key }) => label.includes(key)) || fallback

  const fill: string = highlight ? '#6166DC' : '#DADADA'

  return (
    <Label>
      <Icon fill={fill} />
      <LabelText>
        <Regular highlight={highlight}>{key}</Regular>
        <Highlight highlight={highlight}>{label.split(key)[1]}</Highlight>
      </LabelText>
    </Label>
  )
}

const Label = styled.div`
  display: flex;
  align-items: center;
`

const LabelText = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
`

const Regular = styled.div<{ highlight: boolean | undefined }>`
  color: ${p => (p.highlight ? '#fff' : p.theme.colors.moon)};
  margin-right: 5px;
`

const Highlight = styled.div<{ highlight: boolean | undefined }>`
  color: ${p => (p.highlight ? p.theme.colors.purple : p.theme.colors.moon)};
  font-weight: 600;
`

const Form = styled.form`
  padding: 24px 24px 0 24px;
  margin-bottom: 30px;
`

const List = styled.ul`
  position: relative;
  list-style: none;
  height: 246px;
  overflow-y: scroll;
`

const Shortcut = styled.li<{ highlight: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${p => (p.highlight ? 'rgba(17, 18, 22, 0.5)' : 'transparent')};
  padding: 0 24px;
  height: 64px;
  font-size: 18px;
  color: ${p => p.theme.colors.moon};
`

const ShortcutKeys = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;

  div {
    display: flex;
    justify-content: center;
    height: 16px;
    min-width: 16px;
    text-align: center;
    border-radius: 2.5px;
    padding: 1px 4px;
    color: #000;
    background: #fff;

    &:not(:last-child) {
      margin-right: 8px;
    }
  }
`

const StyledInput = styled.input`
  height: 44px;
  width: 100%;
  background: transparent;
  font-size: 36px;
  color: ${p => p.theme.colors.moon};
  border: none;
  caret-color: ${p => p.theme.colors.purple};

  ::-webkit-input-placeholder {
    color: rgba(255, 255, 255, 0.15);
    font-weight: 200;
  }
  ::placeholder {
    color: rgba(255, 255, 255, 0.15);
    font-weight: 200;
  }
`
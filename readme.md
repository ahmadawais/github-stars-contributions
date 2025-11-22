<h4 align="center">
    <a href="https://nodecli.com/?utm_source=FOSS&utm_medium=FOSS&utm_campaign=github-stars-contributions">
        <img src="https://user-images.githubusercontent.com/960133/135865840-9ed76789-fe17-41d3-af1b-f901519a0ea4.png" alt="github-stars-contributions" />
</a>
<br>
<br>

Log your GitHub Stars Contributions from the command line.

<br>

[![DOWNLOADS](https://img.shields.io/npm/dt/github-stars-contributions?style=for-the-badge&label=Downloads&colorA=2D2A56&colorB=4D2AFF)](https://www.npmjs.com/package/github-stars-contributions) [![Learn Node.js CLI Automation](https://img.shields.io/badge/-NodeCLI.com%20%E2%86%92-gray.svg?style=for-the-badge&label=Downloads&colorA=2D2A56&colorB=4D2AFF)](https://nodecli.com/?utm_source=GitHubFOSS) [![Follow @_ahmadawais on X](https://img.shields.io/badge/FOLLOW%20@_ahmadawais%20%E2%86%92-gray.svg?style=for-the-badge&label=Downloads&colorA=2D2A56&colorB=4D2AFF)](https://x.com/_ahmadawais/)

</h4>

<br>

## Features

- **Interactive Mode** — Beautiful prompts with auto-complete and validation
- **CLI Mode** — Non-interactive mode with `-x` flag for automation
- **Smart Defaults** — Auto-fetches metadata from URLs (title, description, date)
- **TypeScript** — Fully typed for better developer experience
- **Tested** — 24 comprehensive tests covering all features

<br>

## Install

```sh
npm install -g github-stars-contributions
# or
npx github-stars-contributions
```

<br>

## Usage

### Interactive Mode (Default)

```sh
# Add a contribution
gsc add

# Remove a contribution
gsc remove
```

### CLI Mode (Non-Interactive)

```sh
# Add a contribution
gsc add -x -t BLOGPOST -u https://example.com -d 2024-01-15 -T "Title" -D "Description"

# Remove a contribution
gsc remove -x -i contribution-id
```

<br>

## Commands

### `gsc add` or `gsc a`

Add a new contribution (interactive by default).

**Options:**

- `-t, --type <type>` — Contribution type (required in CLI mode)
  - `OTHER`
  - `FORUM`
  - `SPEAKING`
  - `BLOGPOST`
  - `HACKATHON`
  - `VIDEO_PODCAST`
  - `ARTICLE_PUBLICATION`
  - `EVENT_ORGANIZATION`
  - `OPEN_SOURCE_PROJECT`
- `-u, --url <url>` — Contribution URL (optional, auto-fetches metadata)
- `-d, --date <date>` — Date in YYYY-MM-DD format (defaults to today)
- `-T, --title <title>` — Contribution title (required in CLI mode)
- `-D, --description <description>` — Description (required in CLI mode)
- `-x, --no-interactive` — Disable interactive mode

### `gsc remove` or `gsc r`

Remove a contribution (interactive by default).

**Options:**

- `-i, --id <id>` — Contribution ID (required in CLI mode)
- `-x, --no-interactive` — Disable interactive mode

### Global Options

- `-v, --version` — Show version
- `-h, --help` — Show help

<br>

## Examples

**Add a blog post:**
```sh
gsc add -x -t BLOGPOST -u "https://awais.dev/my-post" -d "2024-01-15" -T "Building Better CLIs" -D "A guide to creating amazing command-line tools"
```

**Add a speaking engagement:**
```sh
gsc add -x -t SPEAKING -u "https://conference.com/talk" -d "2024-06-13" -T "AI Primitives over Frameworks" -D "Why composable primitives beat monolithic frameworks"
```

**Interactive mode with auto-fetch:**
```sh
gsc add
# Paste a YouTube URL and watch it auto-fill title, description, and date
```

**Remove a contribution:**
```sh
gsc remove -x -i cmi9bx8pg0009qk012t44af1n
```


<br>

[![📝](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/log.png)](changelog.md)

## Changelog

[❯ Read the changelog here →](changelog.md)

<br>

<small>**KEY**: `📦 NEW`, `👌 IMPROVE`, `🐛 FIX`, `📖 DOC`, `🚀 RELEASE`, and `🤖 TEST`

> _I use [Emoji-log](https://github.com/ahmadawais/Emoji-Log), you should try it and simplify your git commits._

</small>

<br>

[![📃](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/license.png)][repo]

## License & Conduct

- Thanks to the GitHub team for an awesome GraphQL API.
- MIT © [Ahmad Awais](https://twitter.com/_AhmadAwais/).
- [Code of Conduct](code-of-conduct.md).

<br>

[![🙌](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/connect.png)][repo]

## Connect

<div align="left">
    <p><a href="https://github.com/ahmadawais"><img alt="GitHub @AhmadAwais" align="center" src="https://img.shields.io/badge/GITHUB-gray.svg?colorB=6cc644&style=flat" /></a>&nbsp;<small><strong>(follow)</strong> To stay up to date on free & open-source software</small></p>
    <p><a href="https://twitter.com/_AhmadAwais/"><img alt="Twitter @_AhmadAwais" align="center" src="https://img.shields.io/badge/TWITTER-gray.svg?colorB=1da1f2&style=flat" /></a>&nbsp;<small><strong>(follow)</strong> To get #OneDevMinute daily hot tips & trolls</small></p>
    <p><a href="https://www.youtube.com/AhmadAwais"><img alt="YouTube AhmadAwais" align="center" src="https://img.shields.io/badge/YOUTUBE-gray.svg?colorB=ff0000&style=flat" /></a>&nbsp;<small><strong>(subscribe)</strong> To tech talks & #OneDevMinute videos</small></p>
    <p><a href="https://AhmadAwais.com/"><img alt="Blog: AhmadAwais.com" align="center" src="https://img.shields.io/badge/MY%20BLOG-gray.svg?colorB=4D2AFF&style=flat" /></a>&nbsp;<small><strong>(read)</strong> In-depth & long form technical articles</small></p>
    <p><a href="https://www.linkedin.com/in/_AhmadAwais/"><img alt="LinkedIn @_AhmadAwais" align="center" src="https://img.shields.io/badge/LINKEDIN-gray.svg?colorB=0077b5&style=flat" /></a>&nbsp;<small><strong>(connect)</strong> On the LinkedIn profile y'all</small></p>
</div>

[repo]: https://github.com/AhmadAwais/github-stars-contributions

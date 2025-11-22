<h4 align="center">
    <a href="https://nodecli.com/?utm_source=FOSS&utm_medium=FOSS&utm_campaign=github-stars-contributions">
        <img src="https://user-images.githubusercontent.com/960133/135865840-9ed76789-fe17-41d3-af1b-f901519a0ea4.png" alt="github-stars-contributions" />
</a>
<br>
<br>

Log your GitHub Stars Contributions from the command line.

<br>

[![DOWNLOADS](https://img.shields.io/npm/dt/github-stars-contributions?style=for-the-badge&label=Downloads&colorA=191D20&colorB=268637)](https://www.npmjs.com/package/github-stars-contributions) [![Learn Node.js CLI Automation](https://img.shields.io/badge/-NodeCLI.com%20%E2%86%92-gray.svg?style=for-the-badge&label=Downloads&colorA=191D20&colorB=268637)](https://nodecli.com/?utm_source=GitHubFOSS) [![Follow @_ahmadawais on X](https://img.shields.io/badge/FOLLOW%20@_ahmadawais%20%E2%86%92-gray.svg?style=for-the-badge&label=Downloads&colorA=191D20&colorB=268637)](https://x.com/_ahmadawais/)

</h4>

<br>

# CLI: github-stars-contributions `gsc`

> 👨‍🏫 [Awais][t] taught and created this CLI project in his [NodeCLI.com][n] automation course

- 📦 Add a contribution of any type
- 🗃️ Remove a contribution in case of a mistake
- 🤯 Autocomplete search with type and filter function
- 🤯 Adding YouTube? `gsc` CLI can fetch title, date, and description for you
- 👨‍🏫 [Awais][t] taught and created this CLI project in his [NodeCLI.com][n] automation course

<br>

[![📟](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/install.png)][repo]

## Install

```sh
# Recommended.
npx github-stars-contributions

# OR an alternative global install.
npm install -g github-stars-contributions
gsc # run global alias
```

<br>

[![⚙️](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/usage.png)][repo]

## Usage

The CLI supports both **interactive** (default) and **non-interactive** modes for automation.

### Add Contributions

#### 💬 Interactive Mode (Default)

Run `gsc add` and answer the prompts:

![ADD](https://user-images.githubusercontent.com/960133/135862046-6b9f990b-86d4-4c8a-af00-230c86691cf7.gif)

```sh
gsc add
# OR
gsc a
```

You'll be asked:
- Contribution Type
- URL (optional)
- Title
- Description
- Date

#### 🤖 Non-Interactive Mode (Automation)

Perfect for CI/CD pipelines and scripts:

```sh
gsc add \
  -t BLOGPOST \
  -T "My Blog Post" \
  -D "Description here" \
  -d 2025-11-22 \
  -u https://example.com \
  -x
```

### Remove Contributions

#### 💬 Interactive Mode (Default)

Search and select contributions to remove:

![Remove gif](https://user-images.githubusercontent.com/960133/135863013-2fd9e9e7-851e-45e7-8d2b-889ef90cace5.gif)

```sh
gsc remove
# OR
gsc r
```

*Search for the contribution, select it, and press enter to remove. Easy peasy!*

#### 🤖 Non-Interactive Mode (Automation)

Remove by contribution ID:

```sh
gsc remove -i <contribution-id> -x
```

<br>

## 📚 Command Reference

![help gif](https://user-images.githubusercontent.com/960133/135862743-69404ff3-afe9-47cc-9922-b1c15a60d2a3.gif)

### Basic Syntax

```sh
github-stars-contributions <command> [options]
# OR
gsc <command> [options]
```

### Global Options

| Option | Description |
|--------|-------------|
| `-v, --version` | Output the version number |
| `-h, --help` | Display help for command |

### Commands

| Command | Alias | Description |
|---------|-------|-------------|
| `add [options]` | `a` | Add a new contribution (interactive by default) |
| `remove [options]` | `r` | Remove a contribution (interactive by default) |
| `help [command]` | - | Display help for command |

---

### `add` Command

Add a new contribution to your GitHub Stars profile.

**Usage:**
```sh
gsc add [options]
gsc a [options]
```

**Options:**

| Option | Description | Required |
|--------|-------------|----------|
| `-t, --type <type>` | Contribution type (see types below) | Yes (non-interactive) |
| `-T, --title <title>` | Contribution title | Yes (non-interactive) |
| `-D, --description <description>` | Contribution description | Yes (non-interactive) |
| `-d, --date <date>` | Date in YYYY-MM-DD format (default: today) | Yes (non-interactive) |
| `-u, --url <url>` | Contribution URL | No |
| `-x, --no-interactive` | Disable interactive mode | No |
| `-h, --help` | Display help | No |

**Contribution Types:**
- `OTHER`
- `FORUM`
- `SPEAKING`
- `BLOGPOST`
- `HACKATHON`
- `VIDEO_PODCAST`
- `ARTICLE_PUBLICATION`
- `EVENT_ORGANIZATION`
- `OPEN_SOURCE_PROJECT`

**Examples:**

```sh
# Interactive mode (default)
gsc add

# Non-interactive mode with all options
gsc add \
  -t BLOGPOST \
  -T "My Blog Post" \
  -D "Description here" \
  -d 2025-11-22 \
  -u https://example.com \
  -x

# Non-interactive without URL
gsc add -t SPEAKING -T "Conference Talk" -D "Talked about Node.js" -d 2025-11-20 -x
```

---

### `remove` Command

Remove a contribution from your GitHub Stars profile.

**Usage:**
```sh
gsc remove [options]
gsc r [options]
```

**Options:**

| Option | Description | Required |
|--------|-------------|----------|
| `-i, --id <id>` | Contribution ID to remove | Yes (non-interactive) |
| `-x, --no-interactive` | Disable interactive mode | No |
| `-h, --help` | Display help | No |

**Examples:**

```sh
# Interactive mode (default) - search and select
gsc remove

# Non-interactive mode with ID
gsc remove -i abc123 -x
```

<br>

[![📝](https://raw.githubusercontent.com/ahmadawais/stuff/master/images/git/log.png)](changelog.md)


## Changelog

[❯ Read the changelog here →](changelog.md)

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
    <p><a href="https://github.com/ahmadawais"><img alt="GitHub @AhmadAwais" align="center" src="https://img.shields.io/badge/GITHUB-gray.svg?colorB=191D20&style=for-the-badge" /></a>&nbsp;<small><strong>(follow)</strong> To stay up to date on free & open-source software</small></p>
    <p><a href="https://twitter.com/_AhmadAwais/"><img alt="Twitter @_AhmadAwais" align="center" src="https://img.shields.io/badge/X/TWITTER-gray.svg?colorB=191D20&style=for-the-badge" /></a>&nbsp;<small><strong>(follow)</strong> To get #OneDevMinute daily hot tips & trolls</small></p>
    <p><a href="https://www.youtube.com/AhmadAwais"><img alt="YouTube AhmadAwais" align="center" src="https://img.shields.io/badge/YOUTUBE-gray.svg?colorB=191D20&style=for-the-badge" /></a>&nbsp;<small><strong>(subscribe)</strong> To tech talks & #OneDevMinute videos</small></p>
    <p><a href="https://AhmadAwais.com/"><img alt="Blog: AhmadAwais.com" align="center" src="https://img.shields.io/badge/MY%20BLOG-gray.svg?colorB=191D20&style=for-the-badge" /></a>&nbsp;<small><strong>(read)</strong> In-depth & long form technical articles</small></p>
    <p><a href="https://www.linkedin.com/in/_AhmadAwais/"><img alt="LinkedIn @_AhmadAwais" align="center" src="https://img.shields.io/badge/LINKEDIN-gray.svg?colorB=191D20&style=for-the-badge" /></a>&nbsp;<small><strong>(connect)</strong> On the LinkedIn profile y'all</small></p>
</div>

[repo]: https://github.com/AhmadAwais/github-stars-contributions
[t]: https://twitter.com/_AhmadAwais/
[n]: https://nodecli.com/?utm_source=FOSS&utm_medium=FOSS&utm_campaign=github-stars-contributions

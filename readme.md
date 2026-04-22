<p align= "center">
<img src="https://git.crafterpika.cc/kittentm/splatnet/raw/branch/main/cover.png" width=600>
<br>

   <img src="https://git.crafterpika.cc/kittentm/splatnet/raw/branch/main/currentprogress.png" height=50px> 
  <img src="https://progress-bar.xyz/60?title=&height=20&show_text=false" width="100%" height=20px>
  <br>
  <strong>Basically 0% lol</strong>
</p>

---

## Dependencies
This project operates on a frontend - backend basis. The backend is not optional, it is required. As for hosting this front end, you can use anything you would like. The production server uses [Caddy](https://caddyserver.com/) if you need an example.

🔗 [Backend Repo](https://git.crafterpika.cc/kittentm/splatnet-backend)

## Project Status

### Website

- [x] Site Policy

- [ ] Rank
  - [x] Rank Calc / mode
  - [x] HTML for reg/gachi/fest
  - [ ] Auto-post on twitter

- [x] Equipment
  - [x] Show most recent weapon
  - [x] Show current Rank + Level
  - [x] Show all weapons w/ turf inked #

- [ ] Friends List
  - [ ] Support for fetching friends [Push this!](https://discord.com/channels/460820022777085983/835181904880730142/1470216180030771433)
  - [ ] Posting to twitter

- [x] Stage Info
    - [x] Basic Stage Fetching
      - [x] Ditch Splatcord API to allow use for other networks other than pretendo
    - [x] Show stage pngs
    - [x] Show all stage times
    - [x] Show Ranked Mode
    - [x] Support fest stages
    - [x] Show fest information

- [x] Main Page
  - [x] HTML
  - [x] Autologin support

- [x] Login Page
    - [x] HTML
    - [x] Log in support via SPFN

- [x] Title Bar

- [x] Page switching (hamburger menu)
  - [x] Show Mii name
  - [x] Render mii via [mii-unsecure](https://mii-unsecure.ariankordi.net/)
  - [x] Link/unlink Twitter functionality

- [x] Squid swimming background
  - [x] Port to use canvas

- [ ] Proper mobile support
  - [ ] Mobile formatting
- [ ] Japanese localization (see japanese branch)

### Judd
- [x] Recieve & store telemetry
- [x] Port to Postgres
- [ ] Validation
  - [x] Check for Test Tees
  - [ ] Check for MSN weps
  - [x] Check for Invalid Rule
  - [ ] Track Splatfest Rank & validate
  - [ ] Track Splatfest Power & Validate
  - [ ] Blacklisting from leaderboards
  - [ ] Compare public games maps to rotation
  - [ ] Compare public game rules to rotation
  - [ ] Track whether Fest ID is correct
  - [ ] Store & log fest matches that have been played
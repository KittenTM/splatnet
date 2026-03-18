<p align= "center">
<img src="https://git.crafterpika.cc/kittentm/splatnet-backend/raw/branch/main/cover.png" width=600>
<br>

   <img src="https://git.crafterpika.cc/kittentm/splatnet-backend/raw/branch/main/currentprogress.png" height=50px> 
  <img src="https://progress-bar.xyz/10?title=&height=20&show_text=false" width="100%" height=20px>
  <br>
  <strong>Basically 0% lol</strong>
</p>

---

## Dependencies
This project operates on a frontend - backend basis. The backend is not optional, it is required. As for hosting this front end, you can use anything you would like. The production server uses [Caddy](https://caddyserver.com/) if you need an example.

🔗 [Backend Repo](https://git.crafterpika.cc/kittentm/splatnet-backend)

## Pages HTML recreated:

- [x] Site Policy

### Requires Telemetry portion of backend:
- [ ] Rank
- [x] Equipment
  - [x] Show most recent weapon
  - [x] Show current Rank + Level
  - [x] Show all weapons w/ turf inked #

### Requires backend
- [ ] Friends List
  - [ ] Support for fetching friends [Push this!](https://discord.com/channels/460820022777085983/835181904880730142/1470216180030771433)
- [x] Stage Info
    - [x] Basic Stage Fetching (using pretendo)
      - [x] Ditch Splatcord API to allow use for other networks other than pretendo
    - [x] Show stage pngs
    - [x] Show all stage times
    - [x] Show Ranked Mode
- [x] Main Page
  - [x] HTML
  - [x] Autologin support
- [x] Login Page
    - [x] HTML
    - [x] Log in support via SPFN

### Across all pages:

- [x] Title Bar
- [x] Page switching (hamburger menu)
  - [x] Show Mii name
  - [x] Render mii via [mii-unsecure](https://mii-unsecure.ariankordi.net/)
  - [ ] Link/unlink Twitter functionality
- [x] Squid swimming background
  - [x] Port to use canvas
- [ ] Proper mobile support
  - [ ] Mobile formatting
- [ ] WiiU browser support (DO NOT PRIORITIZE)
- [ ] Japanese localization (maybe?)
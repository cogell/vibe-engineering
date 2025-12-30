# Initital Setup Tasks

- setup AGENTS.md and CLAUDE.md files
  - codex -> /init
  - sym link CLAUDE.md to AGENTS.md  
- setup beads
  - bd init
  - bd onboard (add the output to your agents file)
  - in .beads/config.yaml, set `sync-branch: "beads-sync"`
  - add this to your .gitignore
    - ```
      # Beads (local db files)
      .beads/beads.db
      .beads/beads.db-*
      .beads/bd.sock
      .beads/bd.pipe
      .beads/.exclusive-lock
      .beads/daemon.lock
      .beads/daemon.log
      .git/beads-worktrees/
      ```
- setup beads viewer
  - bv (open in terminal and it will prompt to update AGENTS.md)
- setup styleguide
  - bring in STYLE_GUIDE.md
  - make sure it is referenced in AGENTS.md

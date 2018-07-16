A bunch of random mostly self-contained modules and macros for SugarCube 2, in Twee format

# Macros

* macro/pronouns.tw

  Some simple pronoun macros to make the game text easier to write for NPCs and a PC with unknown pronoun. Use `<<He $npc_one>> looked into <<herhis $npc_two>> face with disgust.` to substitute "He", "She", "her" or "his" as appropriate depending on the NPC's gender.
  
* macro/show.tw

  Two macros to show some hidden element by its ID, analogue to `<<replace>>` and `<<linkreplace>>` for replacing an element by ID.
  
# Modules

All modules are written with an UMD-like wrapper, which means they can be either added as-is into a SugarCube's JavaScript portion (then they will set themselves up as `setup.Modulename`) or loaded via `importScript()` or extendJS.

* module/items.js

  Some basic item implementation for RPG-like games. Badly in need of documentation. Currently requires lodash and SugarCube.
  
* module/random.js

  Simple random distribution classes for continuous distributions, suitable for procedural generation or other random sampling where the precise form of the distribution is important. Supported distributions are uniform, normal, skewed normal, gamma, triangular and Kumaraswamy. Should be independent from the running environment.

For more bits and pieces of re-usable SugarCube 2 code, see also:
* https://github.com/ChapelR/custom-macros-for-sugarcube-2

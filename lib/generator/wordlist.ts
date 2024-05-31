import {sampleSize} from 'lodash';

class MySentencelist {
  private wordlist: string[];
  private animal:string;

  constructor() {
    //this.wordlist = ["Dragon", "Castle", "Moon", "Forest", "Apple", "Fish", "Green", "Banana", "Eevee", "Inspiration"];
    this.animal = "{Aardvark|Albatross|Alligator|Alpaca|Ant|Anteater|Antelope|Ape|Armadillo|Donkey|Baboon|Badger|Barracuda|Bat|Bear|Beaver|Bee|Bison|Boar|Buffalo|Butterfly|Camel|Capybara|Caribou|Cassowary|Cat|Caterpillar|Cattle|Chamois|Cheetah|Chicken|Chimpanzee|Chinchilla|Chough|Clam|Cobra|Cockroach|Cod|Cormorant|Coyote|Crab|Crane|Crocodile|Crow|Curlew|Deer|Dinosaur|Dog|Dogfish|Dolphin|Dotterel|Dove|Dragonfly|Duck|Dugong|Dunlin|Eagle|Echidna|Eel|Eland|Elephant|Elk|Emu|Falcon|Ferret|Finch|Fish|Flamingo|Fly|Fox|Frog|Gaur|Gazelle|Gerbil|Giraffe|Gnat|Gnu|Goat|Goldfinch|Goldfish|Goose|Gorilla|Goshawk|Grasshopper|Grouse|Guanaco|Gull|Hamster|Hare|Hawk|Hedgehog|Heron|Herring|Hippopotamus|Hornet|Horse|Human|Hummingbird|Hyena|Ibex|Ibis|Jackal|Jaguar|Jay|Jellyfish|Kangaroo|Kingfisher|Koala|Kookabura|Kouprey|Kudu|Lapwing|Lark|Lemur|Leopard|Lion|Llama|Lobster|Locust|Loris|Louse|Lyrebird|Magpie|Mallard|Manatee|Mandrill|Mantis|Marten|Meerkat|Mink|Mole|Mongoose|Monkey|Moose|Mosquito|Mouse|Mule|Narwhal|Newt|Nightingale|Octopus|Okapi|Opossum|Oryx|Ostrich|Otter|Owl|Oyster|Panther|Parrot|Partridge|Peafowl|Pelican|Penguin|Pheasant|Pig|Pigeon|Pony|Porcupine|Porpoise|Quail|Quelea|Quetzal|Rabbit|Raccoon|Rail|Ram|Rat|Raven|Red deer|Red panda|Reindeer|Rhinoceros|Rook|Salamander|Salmon|Sand Dollar|Sandpiper|Sardine|Scorpion|Seahorse|Seal|Shark|Sheep|Shrew|Skunk|Snail|Snake|Sparrow|Spider|Spoonbill|Squid|Squirrel|Starling|Stingray|Stinkbug|Stork|Swallow|Swan|Tapir|Tarsier|Termite|Tiger|Toad|Trout|Turkey|Turtle|Viper|Vulture|Wallaby|Walrus|Wasp|Weasel|Whale|Wildcat|Wolf|Wolverine|Wombat|Woodcock|Woodpecker|Worm|Wren|Yak|Zebra}";

    this.wordlist = [
      "{enigmatic|mysterious} {demon|angel|ghost} [royalty] {sitting on|standing beside} {their throne|a cosmic altar}", 
      "{a horde of minions|an array of celestial servants|a legion of spectral beings} {behind|in front of} then", 
      "{close-up|character|portrait} portrait of a "+this.animal+" -{man|woman}", 
      "{servant|god|priest|warrior|gardener|keeper} of {the underworld|the seven worlds|light|darkness|jungle world|cybercrystal|blue fire|electrical storms|the deep heart|the overworld|luxury|dragonkind}",
      "{a} {cute |^3}"+this.animal+" x "+this.animal+" hybrid, pokemon-like creature",
      "{cyborg|steampunk|magical} {mermaid|merman|dolphin} exploring {a coral reef|an underwater city|underwater dunes}",
      "{steampunk|futuristic|ancient} explorer with {an airship|a hoverbike|a time-traveling artifact}",
      "{graceful|agile|mysterious} {alien|human|robotic} dancer performing {on stage|in a street|in moonlight}",
      "{neon|sunset|moonlit} cityscape during {a rainstorm|a snowfall|a meteor shower}",
      "{magical|enchanted|cursed} forest guarded by {giant mushrooms|sentient trees|whimsical spirits}",
      "{lonely|brave|curious} lighthouse keeper with {a ghostly|an animal|a supernatural} companion",
      "{haunted|abandoned|ancient} mansion inhabited by {quirky|creepy|kind} spirits",
      "{futuristic|old-fashioned|magical} train racing through {a desert|a tundra|a jungle} landscape",
      "{underwater|sky|space} pirate captain with {a submarine|an airship|a spaceship} ship",
      "{time-traveling|interdimensional|supernatural} detective with {a pet dinosaur|a ghostly sidekick|a shape-shifting familiar}",
      "{robotic|medieval|fantasy} knight jousting on {a mechanical|a fire-breathing|a spectral} horse",
      "{ethereal|ancient|cosmic} space goddess floating among {stars|nebulae|galaxies}",
      "{wise|ancient|intelligent} {tree|rock|cloud} spirit with {a magical staff|a crystal orb|an enchanted flute}",
      "{superhero|villain|antihero} with the ability to control {plants|weather|fire}",
      "{flying|hovering|submersible} car chase through {a futuristic|an underwater|a post-apocalyptic} city",
      "{underwater|floating|hidden} cityscape lit by {bioluminescent plants|ancient crystals|magical torches}",
      "{mystical|cursed|prehistoric} cave with {glowing crystal|shimmering ice|luminescent fungus} formations",
      "{post-apocalyptic|futuristic|ancient} wanderer with {a pet robot|a loyal animal companion|a supernatural guide}",
      "{masked|armored|stealthy} vigilante perched {on a skyscraper|in a tree|atop a cliff}",
      "{sorceress|witch|alchemist} brewing {a potion|a spell|a concoction} in {her hidden lair|a secret cave|an enchanted laboratory}",
      "{steampunk|cyberpunk|fantasy} inventor with {a mechanical|a magical|a sentient} companion",
      "{cyberpunk|interstellar|paranormal} hacker in {a digital world|a secret network|an alternate reality}",
      "{enchanted|fairy-tale|secret} garden filled with {mythical|unusual|magical} creatures",
      "{cute|fierce|friendly} monster family {going on a picnic|exploring a forest|visiting a village}",
      "{astronaut|alien|time-traveler} discovering {an alien oasis|a hidden planet|a realm beyond time}",
      "{old-fashioned|modern|magical} {ice cream|candy|dessert} parlour with {magical|unusual|dangerous} flavors",
      "{abandoned|haunted|enchanted} amusement park {reclaimed by nature|inhabited by spirits|guarded by creatures}",
      "{warrior|sorceress|queen} riding {a mythical|a giant|an elemental} beast",
      "{vintage|modern|otherworldly} circus with {supernatural|magical|dangerous} performers",
      "{otherworldly|majestic|mysterious} library filled with {ancient|enchanted|forbidden} tomes",
      "{intrepid|fearless|daring} explorer navigating {a perilous|a mysterious|an enchanted} jungle",
      "{cozy|remote|enchanted} cottage in {the mountains|a forest|a magical realm} with {magical|supernatural|ancient} neighbors",
      "{street|stage|televised} magician performing {a jaw-dropping|a dangerous|an enchanting} illusion",
      "{mighty|ancient|winged} dragon {slumbering|guarding|hiding} atop {a hoard of treasure|enchanted crystals|cursed artifacts}",
      "{chibi-style|cartoon|realistic} superheroes {saving the day|battling villains|protecting a city}",
      "{whimsical|industrial|supernatural} factory where {dreams|nightmares|wishes} are manufactured",
      "{space|intergalactic|time-traveling} cowboy hunting {intergalactic outlaws|ancient threats|supernatural foes}",
      "{necromancer|summoner|witch} raising {an army of the undead|elemental creatures|magical beings}",
      "{brave|cursed|legendary} warrior with {a haunted|an enchanted|a sentient} weapon",
      "{interdimensional|cosmic|paranormal} {coffee|tea|dessert} shop frequented by {odd|magical|alien} patrons",
      "{enchanted|bewitched|sacred} forest populated by {sentient|magical|cursed} trees",
      "{cybernetic|supernatural|mystical} musician creating {otherworldly|haunting|hypnotic} tunes",
      "{alien|lost|ancient} civilization thriving on {a floating island|a hidden continent|an undiscovered planet}"
    ]
  }

  getPrompt(num: number): string {
    return sampleSize(this.wordlist, 1).toString();
  }
}

export default MySentencelist;
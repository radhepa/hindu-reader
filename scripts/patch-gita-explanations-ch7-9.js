// Patches gita.json with explanations for Chapters 7-9.
// Style: no em-dashes, no filler, 2-4 sentences per verse.
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../assets/data/gita.json');
const gita = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

const explanations = {
  // CHAPTER 7 — Jnana Vijnana Yoga
  'gita_7_1': 'Krishna tells Arjuna that with mind attached to Him, taking refuge in Him, practicing yoga, Arjuna will know Krishna completely without any doubt. The promise is total: not partial knowledge but full knowledge of what Krishna is.',
  'gita_7_2': 'Krishna will teach both knowledge (jnana) and realized knowledge (vijnana), leaving nothing more to be known. The difference between the two is subtle: jnana is learning, vijnana is direct experience.',
  'gita_7_3': 'Among thousands of people, perhaps one strives for perfection. Among those who strive and reach perfection, perhaps only one truly knows Krishna. The rarity is not discouraging but shows the depth of what is being offered.',
  'gita_7_4': 'Earth, water, fire, air, ether, mind, intelligence, and the ego-sense: these eight form Krishna\'s lower nature (apara prakriti). The eight form the material cosmos as understood in the Sankhya-Yoga framework.',
  'gita_7_5': 'This is the lower nature. But different from it is the higher nature (para prakriti) by which this world is sustained: the Jiva, the living principle. The distinction between matter and the life-principle it sustains is the pivot of this teaching.',
  'gita_7_6': 'Know that all beings have their origin in these two natures. Krishna is the origin and dissolution of the entire universe. The two natures together constitute all of manifest existence.',
  'gita_7_7': 'Nothing exists higher than Krishna. Everything is strung on Him as clusters of gems on a thread. The image of the thread running through all gems captures both the unity and the distinct existence of each thing.',
  'gita_7_8': 'Krishna is the taste in water, the light of the moon and sun, the sacred syllable Om in the Vedas, the sound in ether, and the manhood in men. He is the subtle presence in each element that makes it what it is.',
  'gita_7_9': 'He is the pure fragrance in earth, the radiance in fire, the life-force in all beings, and the austerity of ascetics. The list continues: every positive quality in nature is an expression of the divine.',
  'gita_7_10': 'Know Me as the eternal seed of all beings. I am the wisdom of the wise, the splendor of the splendid. The seed metaphor points to the original generative principle behind all manifest forms.',
  'gita_7_11': 'Krishna is the strength of the strong that is free from desire and passion. He is the desire in beings that is not contrary to dharma. Strength and desire are not wrong in themselves; only their misuse is wrong.',
  'gita_7_12': 'And the states of sattva, rajas, and tamas are from Me alone. But I am not in them; they are in Me. The gunas arise from Krishna but do not contain or define him.',
  'gita_7_13': 'The whole world is deluded by these three states made of the gunas. It does not know Me, who am above the gunas and imperishable. Maya operates through the gunas, and the gunas create a world in which Krishna is hidden.',
  'gita_7_14': 'This divine maya of Mine, made of the gunas, is very difficult to cross. Those who surrender to Me alone cross over this maya. The crossing is not an individual achievement but a gift from the side of surrender.',
  'gita_7_15': 'Those who are evildoers, the lowest among people, those whose knowledge is taken away by maya, and those who follow the nature of demons, do not take refuge in Me. The varieties of non-surrender are listed, not condemned.',
  'gita_7_16': 'Four types of virtuous people worship Me: the distressed, the seeker of knowledge, the seeker of wealth, and the wise person. Each has a different motive, but all have turned toward Krishna.',
  'gita_7_17': 'Among them, the wise person, always in yoga, devoted to the One, is supreme. I am exceedingly dear to that one and that one is dear to Me. The mutual dearness is described as a bond that surpasses all others.',
  'gita_7_18': 'All of them are noble souls. But I regard the wise person as My very Self, since such a person, with disciplined soul, is established in Me alone as the supreme goal.',
  'gita_7_19': 'At the end of many births, the person of knowledge takes refuge in Me, knowing that Vasudeva is all. Such a great soul is very rare. The word "Vasudeva" means "all that exists" and is also a name for Krishna.',
  'gita_7_20': 'Those whose wisdom is taken away by various desires take refuge in other deities, following various religious observances compelled by their own nature. All worship has its source in Krishna, even when it does not reach him directly.',
  'gita_7_21': 'Whichever form any devotee wishes to worship with faith, I make that faith firm for that devotee. All genuine faith is upheld by Krishna, regardless of the specific form it takes.',
  'gita_7_22': 'Endowed with that faith, the devotee seeks to propitiate that form and obtains the desired objects from it. These are indeed granted by Me alone. Krishna is the source of all worship\'s fruits, not the secondary deity.',
  'gita_7_23': 'But the fruit obtained by these people of limited understanding is perishable. Those who worship the gods go to the gods. Those who worship Me come to Me. The quality of the destination matches the quality of the intention.',
  'gita_7_24': 'The unintelligent think of the unmanifest Me as having come into manifestation. They do not know My supreme, imperishable, unsurpassed nature. To reduce Krishna to a finite personality is to miss his essential nature.',
  'gita_7_25': 'I am not revealed to all, being veiled by the yoga-maya. This deluded world does not know Me, who am birthless and unperishing. The concealment is not deception but a function of the structure of maya.',
  'gita_7_26': 'I know the beings past, present, and future, O Arjuna. But no one knows Me. The asymmetry is complete: Krishna knows all; the unrealized being knows nothing of Krishna\'s essential nature.',
  'gita_7_27': 'All beings fall into delusion through the duality arising from desire and hatred. This is the illusion of the pairs of opposites. Every conditioned mind is structured by this pairing.',
  'gita_7_28': 'But those who are free from sin, whose deeds are virtuous, freed from the delusion of duality, worship Me with steadfast determination. Moral purification precedes the clear vision of the divine.',
  'gita_7_29': 'Those who take refuge in Me, striving for liberation from old age and death, know Brahman, the entire adhyatma (the self-related principle), and all of karma.',
  'gita_7_30': 'Those who know Me as adhibhuta (the perishable element), adhidaiva (the divine element), and adhiyajna (the sacrificial element), and who know Me even at the time of death, know Me with disciplined mind.',

  // CHAPTER 8 — Akshara Brahma Yoga
  'gita_8_1': 'Arjuna asks Krishna to explain seven terms used in the previous chapter: Brahman, adhyatma, karma, adhibhuta, adhidaiva, adhiyajna, and how these are to be known at the time of death.',
  'gita_8_2': 'He also asks what is adhiyajna and who it is, and how Krishna is known by the self-controlled at the time of death. The questions are precise and deserve precise answers.',
  'gita_8_3': 'Krishna answers: the imperishable is Brahman; one\'s own highest nature is adhyatma; the offering that causes the origin of beings is called karma. The definitions are compact but dense with meaning.',
  'gita_8_4': 'Adhibhuta is the perishable existence; adhidaiva is the cosmic person (Purusha); adhiyajna is Me, here in this body, O best of embodied beings. Krishna identifies himself as the inner witness present in every body.',
  'gita_8_5': 'Whoever, at the time of death, leaves the body while remembering Me alone, reaches My state. There is no doubt about this. The final thought determines the next existence; this is the practical teaching of this chapter.',
  'gita_8_6': 'Whatever state one remembers at the time of death, abandoning the body, to that state one always goes. Being always absorbed in that thought, O Arjuna. The principle extends to all goals, not just Krishna.',
  'gita_8_7': 'Therefore remember Me at all times and fight. With mind and intelligence offered to Me, you will certainly come to Me. The practical instruction: sustained remembrance during life makes the right final thought natural.',
  'gita_8_8': 'With the mind disciplined by constant practice, not wandering to anything else, one goes to the divine, supreme person, O Arjuna, meditating. Practice (abhyasa) is the means; constancy is the quality.',
  'gita_8_9': 'The one who meditates on the ancient Seer, the ruler, subtler than the atom, the supporter of all, of unthinkable form, sun-colored beyond the darkness. The object of meditation is described in its attributes.',
  'gita_8_10': 'At the time of death, with unmoving mind, endowed with devotion and the power of yoga, bringing life breath to rest between the eyebrows, such a one reaches that divine supreme Purusha.',
  'gita_8_11': 'The knowers of the Vedas speak of the Imperishable; renunciants who are free from passion enter into it; and desiring this, people practice celibacy. I will briefly describe to you that goal.',
  'gita_8_12': 'Having controlled all the gates of the body, confined the mind in the heart, placed one\'s life breath in the head, established in yogic concentration. The technique described is from the Upanishadic tradition.',
  'gita_8_13': 'Uttering the single syllable Om, which is Brahman, remembering Me while departing, abandoning the body, one goes to the highest goal. Om is the sonic form of Brahman; departing in it is returning to it.',
  'gita_8_14': 'For the one who always remembers Me without other thoughts, for that yogi who is constantly united, I am easy to reach. Ease of reach is proportionate to the degree of unbroken remembrance.',
  'gita_8_15': 'Having come to Me, the great souls are not reborn into this impermanent abode of sorrow. They have attained the highest perfection. The characterization of the world as "impermanent abode of sorrow" is not pessimism but realism about conditioned existence.',
  'gita_8_16': 'From the realm of Brahma downward, all worlds are subject to return. But having come to Me, O Arjuna, there is no rebirth. Even the highest cosmic level is within the cycle; only Krishna is beyond it.',
  'gita_8_17': 'Those who know that a day of Brahma lasts a thousand yugas and a night of Brahma lasts a thousand yugas are the knowers of day and night. The cosmic time scale dwarfs human history; even Brahma\'s day and night are within time.',
  'gita_8_18': 'At the coming of day, all manifest things issue forth from the unmanifest. At the coming of night, they dissolve into that same unmanifest. The rhythm of cosmic creation and dissolution is described as a day-night cycle.',
  'gita_8_19': 'This same multitude of beings, having come into existence again and again, dissolves at the coming of night and comes into existence again, helplessly, at the coming of day. The word "helplessly" captures the conditioned nature of existence.',
  'gita_8_20': 'But beyond that unmanifest there is another eternal unmanifest, which is not dissolved when all beings are dissolved. The Imperishable is distinct from and higher than the productive unmanifest of the cosmos.',
  'gita_8_21': 'That unmanifest is called the imperishable. It is said to be the highest goal. Those who reach it do not return. That is My supreme abode. The goal of the yogi is beyond even the cosmological cycle.',
  'gita_8_22': 'That supreme Purusha in whom all beings reside, by whom all this is pervaded, can be reached by devotion directed to Him alone. The path to the highest is devotion; no other condition is listed.',
  'gita_8_23': 'Now I will describe the times at which yogis, departing, go without return and with return. This verse transitions to the teaching of the two paths of departure from the body.',
  'gita_8_24': 'Fire, light, day, the bright fortnight, the six months of the northern passage of the sun: those who depart by these attain Brahman. This is the path of no-return, the devayana or bright path.',
  'gita_8_25': 'Smoke, night, the dark fortnight, the six months of the southern passage: the yogi who departs by these reaches the lunar light and returns. This is the path of return, the pitriyana or dark path.',
  'gita_8_26': 'These two paths, the bright and the dark, are considered eternal for this world. By one a person goes without return; by the other a person returns. The two are perennial features of the cosmos in traditional cosmology.',
  'gita_8_27': 'Knowing these two paths, no yogi is deluded. Therefore at all times be established in yoga, O Arjuna. Knowledge of the paths leads to freedom from confusion about how to live now.',
  'gita_8_28': 'The yogi transcends all the fruits of merit accrued from study of the Vedas, performance of sacrifice, practice of austerity, and gifts of charity. Having known all this, the yogi reaches the supreme primal place.',

  // CHAPTER 9 — Raja Vidya Raja Guhya Yoga
  // Skipping gita_9_22 (already explained)
  'gita_9_1': 'Krishna says he will declare the most secret knowledge to Arjuna, who does not find fault, along with realized knowledge. Knowing this, one will be liberated from all evil. The qualifier "does not find fault" marks Arjuna as a fit recipient.',
  'gita_9_2': 'This is the king of knowledge, the king of secrets, the supreme purifier, immediately knowable by direct experience, in accordance with dharma, easy to practice, and imperishable. The qualities listed are the qualities of realization itself.',
  'gita_9_3': 'Those who have no faith in this dharma do not attain Me, O scorcher of foes. They return to the path of this mortal world. Faith is the first gate; without it the teaching does not take hold.',
  'gita_9_4': 'All this world is pervaded by Me in My unmanifest form. All beings exist in Me; I do not exist in them. The asymmetry is important: the world is contained in the divine, not the other way around.',
  'gita_9_5': 'And yet beings do not exist in Me. Behold My divine yoga: My Self is the source and support of beings yet does not exist in beings. The paradox points to the non-dual nature of the divine: both containing and not contained.',
  'gita_9_6': 'Just as the great wind, always moving everywhere, rests in the ether, know that all beings rest in Me in that way. The wind-in-ether simile captures how something vast and active can rest in something even vaster and still.',
  'gita_9_7': 'All beings go into My nature at the end of a cycle (kalpa), O Arjuna. At the beginning of a new cycle I send them forth again. The creative act is described as periodic and impersonal, like breathing.',
  'gita_9_8': 'Relying on My own nature, I send forth again and again this multitude of beings, helpless by the force of nature. Krishna acts but is not bound; beings are sent forth without being the senders.',
  'gita_9_9': 'Nor do these actions bind Me, O Dhanamjaya. I am seated as though indifferent, unattached to these actions. The creator is unmoved by the creation. This is the model for the karma yogi.',
  'gita_9_10': 'Under My superintendence, nature produces the moving and unmoving. By this reason, O son of Kunti, the world revolves. The divine is the silent witness whose presence makes the whole natural process possible.',
  'gita_9_11': 'Fools disregard Me when I have assumed a human body, not knowing My higher existence as the great Lord of all beings. The paradox of the avatara: the divine is most visible and least recognized when it is most accessible.',
  'gita_9_12': 'Their hopes, their actions, and their knowledge are vain; they are of confused understanding, taking on the demoniacal and deluded nature. The character of those who miss the divine in the human is described, not as condemned, but as lost.',
  'gita_9_13': 'But the great souls, O Arjuna, who are possessed of the divine nature, knowing Me as the imperishable source of beings, worship Me with undivided mind. The opposite of verse 9.12: the great soul recognizes and worships.',
  'gita_9_14': 'Always glorifying Me, striving with steadfast resolve, bowing down to Me with devotion, always disciplined, they worship Me. The practices of the devoted: praise, effort, prostration, discipline.',
  'gita_9_15': 'Others worship through the sacrifice of knowledge, with the face of unity, or of plurality, or in various ways, the cosmic form. Approaches to worship multiply because the divine can be approached from many angles.',
  'gita_9_16': 'I am the ritual, I am the sacrifice, I am the offering to the ancestors, I am the herb, I am the mantra, I am also the butter, I am the fire, and I am the act of offering. Every element of traditional Vedic worship is identified with Krishna.',
  'gita_9_17': 'I am the father of this universe, the mother, the supporter, the grandfather, the knowable, the purifier, the syllable Om, the Rig, Sama, and Yajur Vedas.',
  'gita_9_18': 'I am the goal, the supporter, the lord, the witness, the abode, the shelter, the dear one, the origin, the dissolution, the foundation, the treasure, the imperishable seed. The list of divine functions covers every role the divine plays in the life of a devotee.',
  'gita_9_19': 'I give heat; I withhold and send forth rain. I am immortality and also death; I am being and also non-being, O Arjuna. The pairs of opposites are both expressions of the one divine; neither side of the pair captures the whole.',
  'gita_9_20': 'The knowers of the three Vedas, who drink the soma juice, whose sins are cleansed, worship Me with sacrifices, seeking to go to heaven. They reach the meritorious world of the king of gods and enjoy divine pleasures.',
  'gita_9_21': 'Having enjoyed that vast heavenly world, they enter the mortal world again when their merit is exhausted. Thus those who follow the dharma of the three Vedas and desire desires come and go. The cycle of the Vedic path is described honestly: finite merit produces finite results.',
  'gita_9_23': 'Those who are devotees of other gods and who worship them with faith, they also worship Me alone, O Arjuna, though not in the right manner. All worship has its ultimate recipient in Krishna; the error is only in the intermediate direction.',
  'gita_9_24': 'For I am the recipient and the lord of all sacrifices. But they do not know Me in truth, and therefore they fall. Incomplete knowledge of the recipient means the offering does not reach its full destination.',
  'gita_9_25': 'The worshipers of the gods go to the gods. The worshipers of the ancestors go to the ancestors. The worshipers of beings go to beings. Those who worship Me come to Me. The principle is consistent: the destination matches the object of worship.',
  'gita_9_26': 'Whoever offers Me with devotion a leaf, a flower, a fruit, or water, I accept that offering of the devoted, presented with love. The offering is defined by devotion, not by its material value.',
  'gita_9_27': 'Whatever you do, whatever you eat, whatever you offer in sacrifice, whatever you give, whatever austerity you practice, do that as an offering to Me. The entire scope of human activity is to be transformed into an act of devotion.',
  'gita_9_28': 'Thus you will be liberated from the bonds of action that produce good and evil fruits. With the self disciplined by renunciation-yoga and liberated, you will come to Me. The freedom from karma is not the suppression of action but its reorientation.',
  'gita_9_29': 'I am the same in all beings. There is none hateful or dear to Me. But those who worship Me with devotion are in Me and I also am in them. The divine is impartial; the relationship with devotees is unique without being exclusive.',
  'gita_9_30': 'Even if a person of very evil conduct worships Me with undivided devotion, that person should be considered righteous, for that person has rightly resolved. The turning of devotion is itself the act of righteousness.',
  'gita_9_31': 'Quickly that person becomes dharmic and attains everlasting peace. Know for certain, O Arjuna, that My devotee is never lost. The certainty of the promise is offered as a ground for Arjuna\'s own commitment.',
  'gita_9_32': 'For those who take refuge in Me, O Arjuna, though they may be born of sin, women, merchants, or servants, they also attain the highest goal. The universality of the path of devotion is explicit and counter to the exclusions of ritual religion.',
  'gita_9_33': 'How much more so for the pure Brahmins and devoted royal sages? Having come to this impermanent, joyless world, worship Me. If the path is open to all, those with greater access to teaching have even more reason to follow it.',
  'gita_9_34': 'Fix the mind on Me, be devoted to Me, worship Me, bow to Me. Thus disciplined, with Me as the highest aim, you will come to Me. The final verse of Chapter 9 is a fourfold invitation: think, devote, worship, bow.',

};

// Apply patches
let updated = 0;
for (const verse of gita.verses) {
  const exp = explanations[verse.id];
  if (exp) {
    if (!verse.explanations) verse.explanations = {};
    verse.explanations.en = exp;
    updated++;
  }
}

fs.writeFileSync(DATA_PATH, JSON.stringify(gita, null, 2), 'utf8');
console.log('Updated', updated, 'verses. Total with explanations:', gita.verses.filter(v => v.explanations && v.explanations.en).length);

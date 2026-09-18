// Patches gita.json with explanations for Chapters 12-15.
// Style: no em-dashes, no filler, 2-4 sentences per verse.
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../assets/data/gita.json');
const gita = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

const explanations = {
  // CHAPTER 12 — Bhakti Yoga
  'gita_12_1': 'Arjuna asks which class of devotees is better established in yoga: those who worship Krishna as a personal form with constant devotion, or those who worship the imperishable unmanifest? The question is practical: which path should be followed?',
  'gita_12_2': 'Krishna answers: those who fix their minds on Me, who worship Me always disciplined with supreme faith, these I consider to be the most established in yoga. The personal form with devotion is named first as the superior path.',
  'gita_12_3': 'But those who worship the imperishable, the unthinkable, the unmanifest, the all-pervading, the inconceivable, the immovable, the constant, also come to Me.',
  'gita_12_4': 'Having controlled all the senses, with equanimity everywhere, engaged in the welfare of all beings, they reach Me. The way of the unmanifest is harder but also leads to Krishna.',
  'gita_12_5': 'The difficulty is greater for those whose minds are fixed on the unmanifest, because the unmanifest is very hard for embodied beings to reach. The body is the reason the path of form is more accessible.',
  'gita_12_6': 'But those who, dedicating all actions to Me, devoted to Me, meditating on Me, worship Me with exclusive devotion...',
  'gita_12_7': '...those whose thoughts are fixed on Me, I lift up from the ocean of the cycle of death in a short time, O Arjuna. Verses 12.6 and 12.7 form a single promise: total devotion to Krishna is met with total rescue.',
  'gita_12_8': 'Fix the mind on Me alone, let the intelligence enter into Me; thereafter you will dwell in Me alone. There is no doubt about this. The instruction is direct: do not divide the attention.',
  'gita_12_9': 'If you are not able to fix the mind steadily on Me, then by the yoga of practice seek to reach Me, O Dhanamjaya. Practice is the remedy for the inability to concentrate.',
  'gita_12_10': 'If you are not able to practice even, be intent on actions for My sake. Even performing actions for My sake you will attain perfection. The descent from contemplation to action in stages makes the path accessible to all.',
  'gita_12_11': 'If you are not able to do even this, then taking refuge in My yoga, with self-controlled, renounce the fruits of all actions. Renunciation of results is the minimum requirement; even this lifts the practitioner.',
  'gita_12_12': 'Knowledge is better than practice; meditation is superior to knowledge; renunciation of fruit of action is superior to meditation; from renunciation, peace immediately follows. The hierarchy is not meant to discourage but to show the direction of ascent.',
  'gita_12_13': 'The one who has no hatred for any being, who is friendly and compassionate, free from the sense of mine and ego, equal in pleasure and pain, patient. This begins the extended description of the qualities of the dear devotee.',
  'gita_12_14': 'Always contented, the yogi with the self controlled and with firm conviction, with mind and intelligence offered to Me, who is devoted to Me: that person is dear to Me.',
  'gita_12_15': 'One by whom the world is not disturbed, and who is not disturbed by the world, who is free from joy, envy, fear, and distress: that person is dear to Me.',
  'gita_12_16': 'One who is free from expectation, pure, capable, indifferent, untroubled, who has renounced all undertakings, who is devoted to Me: that person is dear to Me.',
  'gita_12_17': 'One who neither rejoices nor hates, neither grieves nor desires, who has renounced both the pleasant and the unpleasant, who is full of devotion: that person is dear to Me.',
  'gita_12_18': 'One who is equal toward enemy and friend, equal in honor and dishonor, equal in cold and heat, pleasure and pain, free from attachment.',
  'gita_12_19': 'One for whom blame and praise are equal, silent, content with whatever comes, homeless, steady-minded, full of devotion: that person is dear to Me.',
  'gita_12_20': 'Those who follow this immortal dharma as described, endowed with faith, devoted to Me as the supreme goal: those devotees are exceedingly dear to Me. The chapter closes not with a command but with a declaration of love.',

  // CHAPTER 13 — Kshetra Kshetrajna Vibhaga Yoga
  'gita_13_1': 'Arjuna asks about prakriti and Purusha, about the kshetra (field) and kshetrajna (knower of the field), and about knowledge and the knowable. These four pairs are the subject of the entire chapter.',
  'gita_13_2': 'Krishna says: this body is called the kshetra (field). Those who know this call the one who knows it the kshetrajna (knower of the field). The field-and-knower framework is the Sankhya basis of the chapter\'s teaching.',
  'gita_13_3': 'Know Me also as the kshetrajna in all kshetras, O Bharata. The knowledge of the kshetra and the kshetrajna I consider to be true knowledge. Krishna identifies himself as the universal knower present in every body.',
  'gita_13_4': 'Hear briefly from Me what that kshetra is, what its nature is, what its modifications are, where it comes from, who the kshetrajna is, and what his power is.',
  'gita_13_5': 'This has been sung in many ways by the seers, in various Vedic hymns, and in the aphorisms of Brahman, with reasoning well established.',
  'gita_13_6': 'The great elements, the ego-principle, the intellect, the unmanifest, the ten senses and one (mind), and the five objects of the senses.',
  'gita_13_7': 'Desire, hatred, pleasure, pain, the aggregate, consciousness, determination: this is the kshetra described briefly with its modifications. The full scope of the field includes both the physical body and the psychological apparatus.',
  'gita_13_8': 'Humility, unpretentiousness, non-violence, patience, uprightness, service of the teacher, purity, steadiness, self-control. This begins the description of knowledge itself, listing the qualities that constitute knowing.',
  'gita_13_9': 'Dispassion toward the objects of the senses, and also absence of ego; seeing the evil in birth, death, old age, sickness, and pain.',
  'gita_13_10': 'Non-attachment, not clinging to son, wife, home, and so on; constant equanimity toward desired and undesired events.',
  'gita_13_11': 'Undivided devotion to Me through yoga; liking for solitary places, disliking crowds.',
  'gita_13_12': 'Constancy in knowledge of the Self, seeing the object of true knowledge: this is declared to be knowledge. What is opposed to this is ignorance. The qualities listed in 13.8-12 are not practices to get knowledge but are themselves what knowledge consists in.',
  'gita_13_13': 'I will describe the object of knowledge, knowing which one attains immortality. The supreme Brahman, beginningless, is called neither being nor non-being. Brahman does not fit within the ontological categories of existence or non-existence.',
  'gita_13_14': 'With hands and feet everywhere, with eyes, heads, and faces everywhere, with ears everywhere, it stands encompassing all in the world. The pervasiveness described is not spatial but ontological: Brahman is in all directions because it is not a located thing.',
  'gita_13_15': 'It shines through all the sense-faculties and yet is without any senses. Unattached and yet sustaining all. Without qualities and yet the experiencer of qualities.',
  'gita_13_16': 'Outside and inside of beings, the moving and the unmoving; due to its subtlety, it is not known. It is far and also near.',
  'gita_13_17': 'Undivided yet existing as if divided in beings; it is to be known as the supporter of beings and also their devourer and creator. The apparent contradiction of being one yet manifesting as many is inherent in the nature of Brahman.',
  'gita_13_18': 'It is the light of lights, said to be beyond darkness. It is knowledge, the knowable, the goal of knowledge. It is seated in the hearts of all.',
  'gita_13_19': 'Thus the kshetra, knowledge, and the object of knowledge have been briefly described. My devotee, understanding this, becomes fit for My state.',
  'gita_13_20': 'Know that both prakriti and Purusha are without beginning. And know that modifications and qualities are born from prakriti. Both are eternal; their relationship produces the manifest world.',
  'gita_13_21': 'Prakriti is said to be the cause of cause, effect, and agent. Purusha is said to be the cause of experiencing pleasure and pain. The two principles have distinct causal roles: matter produces events, the witness experiences them.',
  'gita_13_22': 'The Purusha, residing in prakriti, experiences the qualities born of prakriti. Attachment to the qualities is the cause of birth in good and evil wombs.',
  'gita_13_23': 'The supreme Purusha in this body is also called the witness, the consenter, the supporter, the enjoyer, the great Lord, and the supreme Self. The Purusha is not a passive bystander; it plays multiple relational roles with respect to prakriti.',
  'gita_13_24': 'Whoever thus knows the Purusha and prakriti along with the qualities: in whatever condition he is, he is not born again. The knowledge of the two principles dissolves the cause of rebirth.',
  'gita_13_25': 'Some perceive the Self in the Self through the Self by meditation. Others by the yoga of Sankhya, and others by the yoga of action. The three classical paths are all valid routes to the same realization.',
  'gita_13_26': 'But others who do not know in this way, having heard from others, worship; and they also cross beyond death by taking refuge in what they have heard. Faithful hearing is honored as a legitimate path even without direct understanding.',
  'gita_13_27': 'Whatever being is born, whether moving or unmoving, know that it is from the union of the kshetra and the kshetrajna, O best of Bharatas.',
  'gita_13_28': 'One who sees the supreme Lord equally present in all beings, not destroyed when they are destroyed, truly sees. The equal vision of the divine in all is the practical marker of realized knowledge.',
  'gita_13_29': 'For seeing the Lord equally everywhere, such a person does not harm the Self by the self and then goes to the highest goal. Harm to the Self is the harm that comes from ignorance; it is undone by seeing the Self everywhere.',
  'gita_13_30': 'The one who sees that all actions are performed by prakriti alone, and thus the Self is not the actor, truly sees.',
  'gita_13_31': 'When a person perceives the diverse existence of beings as resting in the one, and spreading out from that alone, then one becomes Brahman. The moment of perception is itself the moment of becoming what is seen.',
  'gita_13_32': 'Because this supreme, imperishable Self, even dwelling in the body, O Arjuna, neither acts nor is tainted; for it is without beginning and without qualities.',
  'gita_13_33': 'Just as all-pervading space is not tainted because of its subtlety, so the Self dwelling in the body everywhere is not tainted. The ether analogy: space is not soiled by what passes through it.',
  'gita_13_34': 'Just as the one sun illumines the whole world, so the owner of the field illumines the whole field, O Bharata. The sun lights all without being contaminated by what it lights.',
  'gita_13_35': 'Those who with the eye of knowledge perceive this distinction between the kshetra and the kshetrajna, and the liberation of beings from prakriti: they go to the Supreme.',

  // CHAPTER 14 — Gunatraya Vibhaga Yoga
  'gita_14_1': 'Krishna says he will again declare the supreme knowledge, the best of all knowledge, knowing which all the sages have gone to the highest perfection after leaving this world.',
  'gita_14_2': 'Those who have taken refuge in this knowledge and attained kinship with My nature are not reborn at the time of cosmic creation nor are they troubled at the time of cosmic dissolution.',
  'gita_14_3': 'The great Brahman is My womb; in it I place the seed. The origin of all beings is from there, O Bharata. Brahman is the universal womb; Krishna\'s creative act is the planting of the seed of consciousness into it.',
  'gita_14_4': 'Whatever forms are produced in all wombs, O Arjuna, the great Brahman is their womb and I am the seed-giving father. The principle of generation is universal; every birth is a version of the same act.',
  'gita_14_5': 'Sattva, rajas, and tamas: these qualities, born of prakriti, bind the immortal embodied Self in the body, O great-armed one. The three gunas are the mechanism by which the unbound Self is apparently bound.',
  'gita_14_6': 'Among these, sattva, being pure, is illuminating and healthy. It binds by attachment to happiness and by attachment to knowledge, O sinless one. Even the highest guna creates its own kind of bondage: attachment to clarity and well-being.',
  'gita_14_7': 'Know rajas to be of the nature of passion, arising from thirst and attachment. It binds the embodied Self, O son of Kunti, through attachment to action.',
  'gita_14_8': 'Know tamas to be born of ignorance, deluding all embodied beings. It binds through negligence, laziness, and sleep, O Bharata.',
  'gita_14_9': 'Sattva attaches to happiness, rajas to action. Tamas, having covered knowledge, attaches to negligence, O Bharata. Each guna pulls the being in a characteristic direction.',
  'gita_14_10': 'Now sattva prevails, having overpowered rajas and tamas. Now rajas, having overpowered sattva and tamas. Now tamas, having overpowered sattva and rajas. The gunas are always in flux; which one dominates shifts.',
  'gita_14_11': 'When the light of knowledge shines through all the gates (senses) of this body, then it may be known that sattva is predominant. The outward sign of sattva is clarity and luminosity.',
  'gita_14_12': 'When rajas is predominant, greed, activity, the undertaking of actions, restlessness, and longing arise, O best of the Bharatas.',
  'gita_14_13': 'When tamas is predominant, lack of illumination, inactivity, negligence, and delusion arise, O descendant of Kuru.',
  'gita_14_14': 'If the embodied one meets death when sattva is predominant, then one attains the pure worlds of those who know the highest.',
  'gita_14_15': 'Meeting death in rajas, one is born among those attached to action. Dying in tamas, one is born from the wombs of the deluded. The guna at the moment of death determines the quality of the next birth.',
  'gita_14_16': 'The fruit of virtuous action is said to be sattvic and pure. The fruit of rajas is pain. The fruit of tamas is ignorance.',
  'gita_14_17': 'From sattva arises knowledge. From rajas arises greed. From tamas arise negligence, delusion, and ignorance.',
  'gita_14_18': 'Those established in sattva go upward. Those in rajas remain in the middle. Those in the lowest quality of tamas go downward.',
  'gita_14_19': 'When the seer perceives no agent other than the gunas, and knows what is higher than the gunas, such a person reaches My state.',
  'gita_14_20': 'Having crossed beyond these three gunas that are the origin of the body, the embodied one, freed from birth, death, old age, and sorrow, attains immortality. Freedom from the gunas is freedom from the cycle.',
  'gita_14_21': 'Arjuna asks: what are the marks of the one who has crossed beyond the three gunas? How does such a person act and how do they transcend the gunas? The question asks for observable signs of the guna-transcendent state.',
  'gita_14_22': 'Krishna answers: the one who does not hate illumination, activity, or delusion when they arise, nor long for them when they have ceased.',
  'gita_14_23': 'The one who remains seated as if indifferent, not disturbed by the gunas, who remains steady and does not waver, knowing that the gunas are acting.',
  'gita_14_24': 'Equal in pleasure and pain, resting in the Self, seeing a lump of earth, a stone, and gold as the same; equal toward the pleasant and unpleasant, firm; equal in blame and praise.',
  'gita_14_25': 'Equal in honor and dishonor, equal toward the side of friends and the side of enemies, having renounced all undertakings: such a person is said to have crossed beyond the gunas.',
  'gita_14_26': 'One who serves Me with an unswerving yoga of devotion, having crossed beyond these gunas, is fit to become Brahman. Bhakti is the means by which the gunas are transcended; it is not itself a guna.',
  'gita_14_27': 'For I am the abode of Brahman, the imperishable, the immortal, the eternal dharma, the absolute happiness. Krishna is the ground in which all the positive qualities of the realized state rest.',

  // CHAPTER 15 — Purushottama Yoga
  'gita_15_1': 'The Ashvattha tree has its roots above and branches below. Its leaves are the Vedic hymns. One who knows it knows the Vedas. The inverted cosmic tree is an ancient image: the roots are in the transcendent; the manifest world hangs below.',
  'gita_15_2': 'Its branches spread below and above, nourished by the gunas; its buds are the sense objects. Its roots spread downward also, binding in the world of men through action.',
  'gita_15_3': 'Its form cannot be perceived here as such, nor its end nor beginning nor its foundation. Having cut this firmly rooted Ashvattha tree with the strong sword of non-attachment.',
  'gita_15_4': 'Then that goal is to be sought, going to which none return: "I seek refuge in that primal Person from whom this ancient extension of creation proceeded." The cutting of the tree is renunciation; the refuge in the Purusha is the act that follows.',
  'gita_15_5': 'Those free from pride and delusion, who have conquered the evil of attachment, always devoted to the Self, with desires turned away, liberated from the pairs of opposites called pleasure and pain, the undeluded reach that imperishable goal.',
  'gita_15_6': 'That which the sun does not illumine, nor the moon, nor fire: that is My supreme abode. Having gone there, one does not return. The ultimate dwelling is self-luminous; no external light reaches or is needed there.',
  'gita_15_7': 'A portion of My own eternal Self becomes the living Self (jiva) in the world of the living and draws to itself the senses that abide in prakriti, of which the mind is the sixth.',
  'gita_15_8': 'When the Lord obtains a body and when He departs from it, He moves together with these (senses and mind), as the wind carries fragrances from their source. The jiva carries its senses as the wind carries scent: invisibly and completely.',
  'gita_15_9': 'Presiding over hearing, sight, touch, taste, and smell, and also the mind, this one enjoys the objects of the senses.',
  'gita_15_10': 'Those who are deluded do not see the one who is departing or remaining or experiencing by contact with the gunas. Those with the eye of knowledge see. The difference between those who see the Self and those who do not is here placed in stark relief.',
  'gita_15_11': 'The yogis who strive perceive this (Self) dwelling in the Self. But those whose Self is not perfected and who are unwise do not perceive this even though striving. Effort alone is not enough; the purification of the Self is also required.',
  'gita_15_12': 'The light of the sun that illumines the whole world, and that which is in the moon and in fire: know that light to be Mine. The light in sun, moon, and fire is presented not as a material phenomenon but as a divine one.',
  'gita_15_13': 'And entering the earth I support all beings with My energy; and I become the nourishing moon and nourish all plants. The divine sustains the world not abstractly but through the actual mechanisms of earth-support and lunar nourishment.',
  'gita_15_14': 'Becoming the fire Vaishvanara, I dwell in the body of beings and, joined with the outgoing and incoming breaths, I digest the fourfold food.',
  'gita_15_15': 'And I am seated in the hearts of all; from Me come memory, knowledge, and their removal. I alone am to be known through all the Vedas; I am the author of the Vedanta and I am the knower of the Vedas.',
  'gita_15_16': 'There are two Purushas in the world: the perishable and the imperishable. All beings are the perishable. The eternal (kutastha) is called the imperishable. The two Purushas are categories, not individuals.',
  'gita_15_17': 'But there is another, the supreme Purusha, called the highest Self, who as the imperishable Lord pervades and sustains the three worlds. The Purushottama is not the perishable jivas nor the cosmic unmanifest but the personal divine who pervades both.',
  'gita_15_18': 'Since I surpass the perishable and am also higher than the imperishable, therefore I am celebrated in the world and in the Veda as the Purushottama. The name Purushottama means "Highest Person"; the chapter is named for this teaching.',
  'gita_15_19': 'Whoever knows Me thus, without delusion, as the Purushottama, knows all; that person worships Me in every way, O Bharata.',
  'gita_15_20': 'Thus this most secret doctrine has been taught by Me, O blameless one. Knowing this, one becomes wise and has accomplished all that should be accomplished, O Bharata. The chapter ends with the claim that this knowledge completes all duty.',
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

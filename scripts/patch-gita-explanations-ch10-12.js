// Patches gita.json with explanations for Chapters 10-12.
// Style: no em-dashes, no filler, 2-4 sentences per verse.
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../assets/data/gita.json');
const gita = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

const explanations = {
  // CHAPTER 10 — Vibhuti Yoga
  'gita_10_1': 'Krishna says he will again speak the supreme word for Arjuna\'s benefit, since Arjuna is dear to him and finds joy in what Krishna says. The reopening of instruction signals a deeper layer of the teaching.',
  'gita_10_2': 'Neither the gods nor the great seers know Krishna\'s origin. He is the source of the gods and the great seers in every respect. The one who is the source cannot be known by those who originate from that source.',
  'gita_10_3': 'Whoever knows Krishna as unborn, without beginning, the great Lord of worlds, that person among mortals is undeluded and liberated from all sins. The specific knowledge liberates.',
  'gita_10_4': 'Intelligence, knowledge, non-delusion, patience, truth, self-control, calmness, pleasure, pain, existence, non-existence, fear, and also courage are all qualities that originate from Krishna.',
  'gita_10_5': 'Non-violence, equanimity, contentment, austerity, generosity, fame, and disgrace: all these different qualities of beings arise from Me alone. The full spectrum of human character, positive and negative, emerges from the same divine source.',
  'gita_10_6': 'The seven great seers of ancient times and the four Manus, from whom the creatures of the world are born, arose from Me, born from the mind. The sages who are the ancestors of all beings were themselves created by Krishna.',
  'gita_10_7': 'Whoever truly knows this manifestation and yoga of Mine is joined to Me through unshakeable yoga. There is no doubt about this. The knowledge is not inert; it produces the very condition it describes.',
  'gita_10_8': 'I am the origin of all; from Me all things proceed. Knowing this, the wise, endowed with devotion, worship Me. The simple cosmological statement in the first line becomes the basis of the entire devotional practice of the second.',
  'gita_10_9': 'With their minds absorbed in Me, with their lives surrendered to Me, enlightening one another, speaking of Me always, they are content and joyful. The community of the devoted is described as mutually reinforcing.',
  'gita_10_10': 'To those who are ever devoted and who worship Me with love, I give the yoga of discrimination by which they come to Me. The gift of discernment is given from within, not learned from outside.',
  'gita_10_11': 'Out of compassion for them, remaining in their own innermost being, I destroy the darkness born of ignorance with the shining lamp of knowledge. The lamp of knowledge is given from inside the devotee.',
  'gita_10_12': 'Arjuna calls Krishna the supreme Brahman, the supreme abode, the supreme purifier, the eternal divine person, the primeval god, the unborn, the all-pervading. The accumulation of epithets expresses Arjuna\'s awe and recognition.',
  'gita_10_13': 'All the seers say this of You: the divine seer Narada, Asita, Devala, Vyasa; and now You yourself tell it to me. Arjuna appeals to the authority of tradition to validate what he is hearing directly from Krishna.',
  'gita_10_14': 'I believe all of this that You tell me to be true, O Keshava. Neither the gods nor the demons know Your manifestation, O Lord. The limits of both divine and demonic knowledge confirm the uniqueness of what Arjuna has received.',
  'gita_10_15': 'You alone know Yourself by Yourself, O Highest Person, O Source of beings, O Lord of beings, O God of gods, O Lord of the world. The self-knowledge of the divine is its own kind of knowledge, not dependent on any external source.',
  'gita_10_16': 'Please tell me fully and without remainder of Your divine manifestations by which You pervade all these worlds and dwell in them. Arjuna asks for the vibhuti teaching: the specific forms in which the divine is most visible.',
  'gita_10_17': 'How am I to know You, O Yogin, always meditating? In what aspects should I think of You? The question asks for practical handles: how to hold the mind on something infinite.',
  'gita_10_18': 'Tell me again in detail of Your yoga and manifestation, O Janardana. I am never satisfied hearing Your nectar-like words. Arjuna\'s hunger for the teaching signals his readiness to receive the vibhuti catalogue.',
  'gita_10_19': 'Krishna agrees to speak of his divine manifestations, but only the prominent ones, since his greatness is endless. What follows is a selective list, not an exhaustive one.',
  'gita_10_20': 'I am the Self dwelling in the heart of all beings. I am also the beginning, the middle, and the end of all beings. The Self is not one vibhuti among others; it is the ground in which all vibhutis rest.',
  'gita_10_21': 'Among the Adityas I am Vishnu; among luminaries, the radiant sun; among the Maruts I am Marichi; among the stars I am the moon. Each category of existence has a preeminent member, and that member is an expression of Krishna.',
  'gita_10_22': 'Among the Vedas I am the Sama-Veda; among the gods I am Vasava (Indra); among the senses I am the mind; in beings I am consciousness. The pairing of cosmic categories with their representatives continues.',
  'gita_10_23': 'And among the Rudras I am Shiva; among the Yakshas and Rakshasas I am the Lord of Wealth (Kubera); among the Vasus I am fire; among mountains I am Mount Meru.',
  'gita_10_24': 'Among priests know Me as Brihaspati, O Arjuna. Among military commanders I am Skanda. Among bodies of water I am the ocean.',
  'gita_10_25': 'Among the great seers I am Bhrigu. Among words I am the single syllable Om. Among sacrifices I am the sacrifice of japa. Among immovable things I am the Himalaya.',
  'gita_10_26': 'Among all trees I am the Ashvattha; among divine seers I am Narada; among the Gandharvas I am Chitraratha; among the siddhas I am the sage Kapila.',
  'gita_10_27': 'Among horses know Me as Ucchaishravas, born from the churning of the ocean. Among great elephants I am Airavata; among human beings I am the king.',
  'gita_10_28': 'Among weapons I am the thunderbolt; among cows I am the wish-fulfilling cow. I am the progenitor Kandarpa (the god of love); among serpents I am Vasuki.',
  'gita_10_29': 'Among the divine serpents I am Ananta; among water-beings I am Varuna; among the ancestors I am Aryama; among controllers I am Yama, the lord of death.',
  'gita_10_30': 'Among the Daityas I am Prahlada; among measurers I am time; among animals I am their king, the lion; among birds I am the eagle Garuda.',
  'gita_10_31': 'Among purifiers I am the wind; among warriors I am Rama; among fish I am the shark; among rivers I am the Ganges.',
  'gita_10_32': 'Among creations I am the beginning, the end, and the middle; among all forms of knowledge I am the knowledge of the Self; among debaters I am the dialectic.',
  'gita_10_33': 'Among letters I am the letter A; among compounds I am the dvandva. I am also everlasting time; I am the creator facing everywhere.',
  'gita_10_34': 'I am all-destroying death, and also the origin of things that are yet to be born. Among the feminine qualities I am fame, beauty, speech, memory, intelligence, constancy, and patience.',
  'gita_10_35': 'Among the hymns of the Sama-Veda I am the Brihat-Sama; among poetic meters I am the Gayatri; among months I am Margashirsha; among seasons I am the flower-bearing spring.',
  'gita_10_36': 'I am the gambling of the deceitful; I am the splendor of the splendid; I am victory; I am effort; I am the goodness of the good. Even qualities that seem morally ambiguous are expressions of the divine when they are the preeminent form.',
  'gita_10_37': 'Among the Vrishnis I am Vasudeva; among the Pandavas I am Dhanamjaya (Arjuna). Among the sages I am Vyasa; among seers I am the seer Ushana. Krishna places Arjuna himself in the list as a divine manifestation.',
  'gita_10_38': 'I am the rod of power of rulers; I am the policy of those who desire to conquer; I am the silence of secrets; I am the knowledge of the knowing.',
  'gita_10_39': 'And I am that which is the seed of all beings. There is no being, moving or unmoving, that can exist without Me. The seed is the irreducible minimum of existence; its source is the divine.',
  'gita_10_40': 'There is no end to My divine manifestations. What I have declared is only an example of the extent of My glory. The list just given is illustrative, not exhaustive. The infinite cannot be exhausted.',
  'gita_10_41': 'Whatever being there is that is glorious, splendid, or powerful, know that to have sprung from a fraction of My splendor. The principle for applying the vibhuti teaching to the whole of life: excellence anywhere points to the divine.',
  'gita_10_42': 'But what need is there for all this detailed knowledge by you? Having pervaded this whole universe with one fragment of Myself, I stand. The teaching ends by undercutting the list: all these categories together are only a fragment of what the divine is.',

  // CHAPTER 11 — Vishvarupa Darshana Yoga
  // Skipping gita_11_55 (already explained)
  'gita_11_1': 'Arjuna says that the teaching about the Self and the supreme secret Krishna has revealed has dispelled his confusion. The formal gratitude marks a transition; Arjuna is now ready to go further.',
  'gita_11_2': 'He has heard from Krishna the origin and dissolution of beings and the eternal greatness of Krishna. And he has heard of the Self as described by Krishna.',
  'gita_11_3': 'Arjuna asks to see the cosmic form of Krishna directly. He wants the ishvara, the divine lord, to show what was described in words as a direct vision.',
  'gita_11_4': 'If You think it possible for me to see it, O Lord, O Master of yoga, show me Your imperishable Self. Arjuna acknowledges that the seeing may not be within ordinary human capacity.',
  'gita_11_5': 'Krishna says: Behold My forms, hundreds and thousands, of various kinds, divine, of various colors and shapes. The vision is not given quietly; it is announced with a word of command.',
  'gita_11_6': 'Behold the Adityas, the Vasus, the Rudras, the two Ashvins, and the Maruts. Behold the many wonders not seen before, O Bharata. The groups named are the divine beings of the Vedic tradition.',
  'gita_11_7': 'Behold today the whole universe moving and unmoving, here in My body, O Gudakesha, and whatever else you wish to see. The cosmic form contains all of existence; the scope is absolute.',
  'gita_11_8': 'But you are not able to see Me with your own eye. I give you the divine eye. Behold My sovereign yoga. Arjuna cannot see the cosmic form with ordinary eyes; Krishna must give him a new capacity.',
  'gita_11_9': 'Sanjaya narrates: having spoken thus, the great Lord of yoga, Hari, then showed to Arjuna the supreme form as the cosmic lord. The cosmic form is not just seen but is a form of Krishna himself, the supreme overlord.',
  'gita_11_10': 'With many mouths and eyes, with many amazing sights, with many divine ornaments, with many raised divine weapons. The description begins to accumulate details that exceed human form.',
  'gita_11_11': 'Wearing divine garlands and garments, with divine fragrances and ointments, all marvels, the god without limit, facing everywhere.',
  'gita_11_12': 'If the light of a thousand suns were to rise all at once in the sky, that might resemble the splendor of that great Self. The comparison is not hyperbole but an honest attempt to gesture at what exceeds all description.',
  'gita_11_13': 'There Arjuna saw the whole universe, divided into many parts, standing all together in the body of the God of gods. The cosmic form is not a series of images but a single body in which everything is simultaneously present.',
  'gita_11_14': 'Then Arjuna, overcome with wonder, with hair standing on end, bowed his head to the god and spoke with joined palms. The physical response to the vision precedes the words: wonder is first felt in the body.',
  'gita_11_15': 'Arjuna says he sees all gods in Krishna\'s body, and multitudes of beings, Brahma the lord seated on the lotus, all the seers, and divine serpents.',
  'gita_11_16': 'He sees the cosmic form with many arms, bellies, mouths, and eyes on all sides, endless, and cannot find beginning or middle or end in it.',
  'gita_11_17': 'He sees the form as crowned, bearing a club and discus, blazing everywhere with a mass of light, hard to look at, shining all around with immeasurable radiance like the sun and fire.',
  'gita_11_18': 'Arjuna says: I believe You are the imperishable, the supreme to be known. You are the ultimate resting place of all this. You are the eternal guardian of the eternal dharma. You are the primal Person, I believe.',
  'gita_11_19': 'He sees Krishna as without beginning, middle, or end, with infinite power, with infinite arms, with moon and sun as eyes, with blazing fire as the mouth, consuming all this universe with Your radiance.',
  'gita_11_20': 'This space between heaven and earth is pervaded by You alone and also all directions. Seeing this wondrous and terrible form of Yours, O great Self, the three worlds tremble.',
  'gita_11_21': 'Groups of gods are entering into You; some, afraid, are praying with joined palms; the hosts of great seers and siddhas are saying "may it be well" and praising You with excellent hymns.',
  'gita_11_22': 'The Rudras, Adityas, Vasus, Sadhyas, Vishvedevas, the two Ashvins, Maruts, the ancestors, and hosts of Gandharvas, Yakshas, demons, and perfected ones all gaze at You in amazement.',
  'gita_11_23': 'Seeing Your immense form with many mouths and eyes, O great-armed One, with many arms, thighs, and feet, many bellies, many terrible tusks, the worlds tremble, and so do I.',
  'gita_11_24': 'On seeing You touching the sky, blazing, many-colored, with open mouths, with large blazing eyes, I am frightened in my inmost self; I find no steadiness, no rest, O Vishnu.',
  'gita_11_25': 'And seeing Your mouths, terrible with tusks, like the fires of universal dissolution, I lose my bearings and find no safety. Be gracious, O Lord of gods, O Abode of the universe.',
  'gita_11_26': 'All the sons of Dhritarashtra together with the hosts of kings, Bhishma, Drona, and the son of the charioteer (Karna), together with our chief warriors also.',
  'gita_11_27': 'Are rushing into Your terrible mouths furnished with tusks, some with heads crushed are seen lodged between the teeth. The vision reveals the outcome of the battle already, in the cosmic form.',
  'gita_11_28': 'As the many torrents of rivers flow toward the ocean, so those heroes in the world of men enter Your blazing mouths. The rivers-to-ocean simile captures both the scale and the one-directionality of the warriors entering the cosmic form.',
  'gita_11_29': 'As moths rush swiftly to a blazing fire and perish there, so too these beings rush swiftly into Your mouths to perish.',
  'gita_11_30': 'You lick up all worlds consuming them on all sides with Your flaming mouths. Your fierce radiance fills the whole universe and scorches it, O Vishnu.',
  'gita_11_31': 'Arjuna asks who Krishna is in this terrible form, and asks him to be gracious. He says he wants to know the Supreme Person, since he does not understand Krishna\'s working.',
  'gita_11_32': 'Krishna answers: I am Time, the great destroyer of worlds, grown ripe, engaged here in destroying all worlds. Even without you, all these warriors arrayed in the opposing armies will cease to exist. The battle\'s outcome is already fixed; Arjuna is not the cause but the instrument.',
  'gita_11_33': 'Therefore arise and win glory; having conquered the enemies, enjoy a prosperous kingdom. They have already been killed by Me. Be you the mere instrument, O Savyasachin. The word "instrument" (nimitta-matram) defines Arjuna\'s role precisely.',
  'gita_11_34': 'Drona, Bhishma, Jayadratha, Karna, and other warrior heroes have already been killed by Me. Kill them without being distressed. Fight. You will conquer the enemies in battle.',
  'gita_11_35': 'Sanjaya reports that Arjuna, having heard these words from Krishna, trembled with joined palms and bowed down. With great fear he again addressed Krishna in a faltering voice.',
  'gita_11_36': 'Arjuna says it is right that the world is delighted and rejoices in Krishna\'s glory, that the demons flee in fear and the hosts of the perfected bow down. The recognition of the cosmic order justifies both the devotees\' reverence and the demons\' flight.',
  'gita_11_37': 'Why should they not bow to You, O Great Self, the original creator? You are Brahman, the infinite, the lord of gods, the abode of the universe. You are the imperishable, the existence, the non-existence, and what is beyond both.',
  'gita_11_38': 'You are the primal god, the ancient person. You are the ultimate resting place of this universe. You are the knower and the knowable and the supreme abode. By You is all this universe pervaded, O one of infinite forms.',
  'gita_11_39': 'You are Vayu, Yama, Agni, Varuna, the moon, Brahma the grandfather, and the father\'s father. Salutation to You a thousand times, and again and again salutation to You.',
  'gita_11_40': 'Salutation to You before and behind, salutation to You on all sides, O All! You are of infinite valor and immeasurable power. You pervade all; therefore You are all. The prostration moves from directional salutations to the recognition of total pervasiveness.',
  'gita_11_41': 'Not knowing Your glory and thinking of You as a friend, I have rashly said "O Krishna, O Yadava, O friend!" Whatever I have said carelessly or affectionately, out of negligence or love.',
  'gita_11_42': 'In whatever way I may have been disrespectful to You while playing or resting or sitting or eating, whether alone or in the presence of others: I beg forgiveness of You, O immeasurable one. Arjuna\'s apology for the familiarity of friendship is disarming in its sincerity.',
  'gita_11_43': 'You are the father of the world, of the moving and the unmoving. You are to be adored by this world; You are the greatest teacher. There is none equal to You; how could there be another greater in the three worlds?',
  'gita_11_44': 'Therefore bowing and prostrating my body, I seek Your grace, O Lord, Adorable One. Like a father with his son, a friend with a friend, a beloved with a beloved, please be patient with me, O God.',
  'gita_11_45': 'Having seen what has never been seen before, I am delighted, yet my mind is troubled with fear. Show me that other form, O God. Be gracious, O Lord of gods, O Abode of the universe. Arjuna wants the familiar human form of Krishna back.',
  'gita_11_46': 'I want to see You as before, with a crown, with a mace, with a discus in hand. Assume that four-armed form again, O thousand-armed one, O universal form. The specific request for the four-armed Vishnu form shows Arjuna\'s preference for the approachable over the terrible.',
  'gita_11_47': 'Krishna says: This primal form of mine has been shown to you through My grace, this supreme, luminous, infinite, primal form which none but you has seen. The vision was a gift, not achievable through human effort alone.',
  'gita_11_48': 'Not through study of the Vedas, not through sacrifice, not through gifts, not through ritual, not through fierce austerity can I be seen in this form in the human world, by any other than you. The cosmic form cannot be earned; it is given.',
  'gita_11_49': 'Be not afraid nor bewildered at seeing this terrible form of Mine. With your fear dispelled and with gladdened heart, behold again this My other form. The reassurance precedes the return to the familiar form.',
  'gita_11_50': 'Sanjaya narrates that having so spoken to Arjuna, Vasudeva showed his own form again and the great Self, having again assumed the gentle form, consoled the frightened one.',
  'gita_11_51': 'Arjuna says that now he sees Krishna\'s human form and his mind is calm and he has come to his normal condition. The word for "normal condition" (prakritim) means his natural state has been restored.',
  'gita_11_52': 'Krishna says this form that Arjuna has seen is very hard to see. Even the gods are always desiring to see this form. Even the gods who know Krishna in the Vishvarupa long for his human form.',
  'gita_11_53': 'I am not able to be seen in this way as you have seen Me, through the Vedas, austerity, gift, or sacrifice. The reversal is complete: the approachable human form is harder to see truly than the cosmic form.',
  'gita_11_54': 'But by devotion to Me alone can I be thus known and seen in truth and entered into, O Arjuna. The chapter\'s conclusion collapses all the paths into one: only devotion reaches the ultimate form.',
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

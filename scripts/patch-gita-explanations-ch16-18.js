// Patches gita.json with explanations for Chapters 16-18.
// Style: no em-dashes, no filler, 2-4 sentences per verse.
// Skipping gita_18_66 (already explained).
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../assets/data/gita.json');
const gita = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

const explanations = {
  // CHAPTER 16 — Daivasura Sampad Vibhaga Yoga
  'gita_16_1': 'Fearlessness, purity of mind, steadiness in the yoga of knowledge, charity, control of the senses, sacrifice, study of scripture, austerity, and uprightness. This begins the list of divine qualities (daivi sampad) that define those fit for liberation.',
  'gita_16_2': 'Non-violence, truth, freedom from anger, renunciation, tranquility, absence of cruelty, compassion for all beings, absence of covetousness, gentleness, modesty, absence of restlessness.',
  'gita_16_3': 'Vigor, patience, fortitude, purity, freedom from malice, and absence of excessive pride: these are the endowments of those born with divine nature, O Bharata.',
  'gita_16_4': 'Arrogance, pride, conceit, anger, harshness, and ignorance are the endowments of those born with demoniacal nature, O Arjuna. The demoniacal qualities are not attributed to particular people but to a mode of being anyone can inhabit.',
  'gita_16_5': 'The divine endowment leads to liberation; the demoniacal endowment is considered to lead to bondage. Do not grieve, O Arjuna; you are born with divine endowment. The verse reassures Arjuna: his grief on the battlefield is evidence of his divine nature, not of weakness.',
  'gita_16_6': 'There are two types of beings created in this world: the divine and the demoniacal. The divine has been described at length; hear from Me, O Arjuna, the demoniacal.',
  'gita_16_7': 'The demoniacal do not know what to do and what to refrain from doing. Neither purity, nor good conduct, nor truth is found in them. The three deficits described are the root deficits: the demoniacal lack orientation, character, and honesty.',
  'gita_16_8': 'They say: the universe has no truth, no support, no God. It is not caused by natural sequence; what other cause is there? Only desire.',
  'gita_16_9': 'Holding this view, these lost souls of small intellect and of cruel deeds rise up as enemies for the destruction of the world. The philosophical position of meaninglessness enables cruelty.',
  'gita_16_10': 'Giving themselves to insatiable desire, full of hypocrisy, pride, and arrogance, holding false views through delusion, they act with impure resolves.',
  'gita_16_11': 'Prey to immeasurable anxieties that last until death, with gratification of desires as their highest goal, convinced that this is all there is.',
  'gita_16_12': 'Bound by hundreds of shackles of hope, given over to desire and anger, they seek by unjust means to accumulate wealth for the gratification of desires.',
  'gita_16_13': '"This has been gained by me today; this desire I shall obtain; this is mine and this wealth also shall be mine in the future."',
  'gita_16_14': '"This enemy has been slain by me; others also I shall slay. I am the lord; I enjoy; I am perfect, powerful, and happy."',
  'gita_16_15': '"I am wealthy and of noble birth. Who else is equal to me? I will sacrifice, I will give, I will rejoice." Thus deluded by ignorance.',
  'gita_16_16': 'Bewildered by many thoughts, ensnared in the mesh of delusion, attached to the gratification of desires, they fall into a foul hell. The internal logic of the demoniacal path leads inevitably downward.',
  'gita_16_17': 'Self-conceited, stubborn, filled with the pride and intoxication of wealth, they perform sacrifices in name only, with hypocrisy, not following the scriptural injunctions.',
  'gita_16_18': 'Ego, power, pride, desire, and anger their support: these malicious people hate Me in their own body and in that of others. The final form of the demoniacal character is hatred of the divine in all its expressions.',
  'gita_16_19': 'These hateful, cruel, vile, and impure persons, I hurl repeatedly into demoniacal wombs in the cycles of rebirth. The hurling into lower births is not punishment but the natural outcome of the direction of one\'s character.',
  'gita_16_20': 'Having come to demoniacal wombs, deluded birth after birth, not attaining Me, O son of Kunti, they fall into the lowest destination.',
  'gita_16_21': 'Lust, anger, and greed: this is the triple gate of hell, destructive of the self. Therefore one should abandon all three. The three are listed together because they reinforce each other; none can be eliminated in isolation.',
  'gita_16_22': 'A person who has escaped these three gates of darkness, O son of Kunti, practices what is good for the Self and therefore reaches the highest goal.',
  'gita_16_23': 'Whoever abandons the scriptural injunctions and acts under the impulse of desire does not attain perfection, nor happiness, nor the highest goal. The scriptural injunctions function as guardrails; abandoning them without wisdom leads to drift.',
  'gita_16_24': 'Therefore let the scripture be your authority in determining what should be done and what should not be done. Having known what is declared by scriptural injunction, you should perform action here in this world.',

  // CHAPTER 17 — Shraddhatraya Vibhaga Yoga
  'gita_17_1': 'Arjuna asks: what is the condition of those who abandon the scriptural injunctions yet worship with faith? Is it sattva, rajas, or tamas? The question is about the person who has genuine faith but no formal training.',
  'gita_17_2': 'Krishna answers: the faith of the embodied is of three kinds, born of their own nature: sattvic, rajasic, and tamasic. Hear about these from Me. Faith is not uniform; it takes the shape of the person\'s predominant guna.',
  'gita_17_3': 'The faith of every person is in accordance with their nature. A person consists of their faith. As their faith is, so they are. The identification of a person with their faith is one of the most searching psychological statements in the Gita.',
  'gita_17_4': 'The sattvic worship the gods. The rajasic worship the Yakshas and Rakshasas. The others, the tamasic people, worship the spirits of the dead and ghosts.',
  'gita_17_5': 'Those who perform severe austerity not enjoined by the scriptures, combined with hypocrisy and ego, impelled by the force of lust and attachment.',
  'gita_17_6': 'Torturing the group of elements in the body and also Me who dwell within the body: know these senseless people to be of demoniacal resolves. Austerity aimed at domination rather than purification injures the Self within.',
  'gita_17_7': 'Food also is of three kinds dear to all; so are sacrifice, austerity, and charity. Hear this distinction of theirs. The chapter moves to the concrete domains of daily life to show how the gunas operate there.',
  'gita_17_8': 'Foods that increase life, purity, strength, health, joy, and cheerfulness, which are tasty, smooth, firm, and pleasant, are dear to the sattvic.',
  'gita_17_9': 'Foods that are bitter, sour, salty, very hot, pungent, dry, and burning are dear to the rajasic, and produce pain, grief, and disease.',
  'gita_17_10': 'Foods that are stale, tasteless, putrid, and decomposed, and which are also the leavings (of others) and impure: these are dear to the tamasic.',
  'gita_17_11': 'The sacrifice that is offered as enjoined by scriptural authority by those who do not desire fruit, with the mind fixed on the performance itself as a duty, is sattvic.',
  'gita_17_12': 'But the sacrifice that is offered with a view to fruit, and also with hypocrisy, O best of Bharatas, know that to be rajasic.',
  'gita_17_13': 'The sacrifice that is performed contrary to the scriptural injunctions, without distribution of food, without chanting, without payment of sacrificial fees, and without faith, is declared to be tamasic.',
  'gita_17_14': 'Worship of the gods, the twice-born, teachers, and the wise; purity, uprightness, celibacy, and non-violence: this is declared to be the austerity of the body.',
  'gita_17_15': 'Speech that does not cause distress, that is true, pleasant, and beneficial, and practice of recitation of scripture: this is declared to be the austerity of speech.',
  'gita_17_16': 'Serenity of mind, gentleness, silence, self-control, purity of nature: this is called the austerity of the mind.',
  'gita_17_17': 'This threefold austerity practiced with utmost faith by people who are not expecting fruit, who are disciplined, is called sattvic.',
  'gita_17_18': 'The austerity that is performed with a view to respect, honor, and worship, and with hypocrisy, is here declared to be rajasic, unstable, and perishable.',
  'gita_17_19': 'The austerity that is performed with foolish stubbornness, with self-torture, or to harm another, is declared to be tamasic.',
  'gita_17_20': 'Charity that is given as a matter of duty to one who does nothing in return, in a proper place and time, and to a worthy person, is considered sattvic. The three conditions are: proper place, proper time, worthy recipient.',
  'gita_17_21': 'But charity given expectantly, and again given with a view to a return, or grudgingly, is considered rajasic.',
  'gita_17_22': 'Charity that is given in a wrong place and time, to an unworthy person, without respect and with contempt, is declared to be tamasic.',
  'gita_17_23': 'Om Tat Sat: this is declared to be the triple designation of Brahman. By this were the Brahmins, the Vedas, and the sacrifices designated from the beginning. The three syllables Om, Tat, and Sat together mark the transcendent ground of all sacred action.',
  'gita_17_24': 'Therefore acts of sacrifice, charity, and austerity as enjoined by the scriptural injunctions are always commenced by the knowers of Brahman with the utterance of Om.',
  'gita_17_25': 'With the utterance of Tat, the acts of sacrifice and austerity and the various acts of charity are performed by the seekers of liberation without aiming at fruit. Tat means "That," pointing to the transcendent without naming it.',
  'gita_17_26': 'Sat is used in the sense of reality and goodness. And also the word Sat is used for an auspicious act, O Arjuna.',
  'gita_17_27': 'Steadfastness in sacrifice, austerity, and charity is also called Sat. And action for the sake of the Lord is also called Sat. All of these are forms of the real (sat) because they are oriented toward what is truly real.',
  'gita_17_28': 'Whatever is offered in sacrifice, given in charity, practiced as austerity, or whatever is done, without faith, that is called Asat, O Arjuna. It is of no account here or in the hereafter. The chapter closes with the negative: action without faith is nothing, regardless of its outer form.',

  // CHAPTER 18 — Moksha Sannyasa Yoga
  'gita_18_1': 'Arjuna asks for the truth about sannyasa and tyaga separately, and the distinction between them, O mighty-armed, O Hrishikesha, O slayer of Keshin.',
  'gita_18_2': 'Krishna answers: by sannyasa the poets understand the giving up of actions motivated by desire. By tyaga the wise understand the relinquishment of the fruits of all actions.',
  'gita_18_3': 'Some wise men say that action should be abandoned as evil. Others say that acts of sacrifice, charity, and austerity should not be abandoned. The debate is genuine and Krishna will resolve it.',
  'gita_18_4': 'Hear from Me the conclusion, the truth of tyaga: tyaga is declared to be of three kinds, O best of Bharatas.',
  'gita_18_5': 'Acts of sacrifice, charity, and austerity should not be abandoned; they should indeed be performed. Sacrifice, charity, and austerity are purifiers of the wise.',
  'gita_18_6': 'But even these actions should be performed leaving aside attachment and fruits: this is My definite and highest view, O Arjuna.',
  'gita_18_7': 'The abandonment of prescribed action is not proper. The abandonment from delusion is declared to be tamasic. If the reason for renunciation is confusion or avoidance, it is the lowest form.',
  'gita_18_8': 'The one who abandons action out of fear of physical suffering, saying "it is troublesome," performs rajasic renunciation and does not obtain the fruit of renunciation.',
  'gita_18_9': 'That which is performed as duty, O Arjuna, having abandoned attachment and also the fruit, that abandonment is regarded as sattvic.',
  'gita_18_10': 'The one who renounces does not shun disagreeable action and is not attached to agreeable action. The renunciant is filled with sattva and has cut off doubts.',
  'gita_18_11': 'For an embodied being, it is not possible to abandon actions entirely. But the one who abandons the fruits of action is called a renunciant.',
  'gita_18_12': 'The threefold fruit of action, the undesirable, the desirable, and the mixed, accrues after death to those who have not renounced. But it never accrues to the renunciants. The threefold fruit covers all possible outcomes; the renunciant is free of all of them.',
  'gita_18_13': 'The Sankhya system declares five causes for the accomplishment of all actions, O mighty-armed. Learn these from Me.',
  'gita_18_14': 'The basis (body), the agent (ego), the various kinds of senses, the various different motions of the vital breaths, and as the fifth, the divine providence. The five causes distribute responsibility: none alone causes the action.',
  'gita_18_15': 'Whatever action a person undertakes with the body, speech, or mind, whether right or wrong, these five are its causes.',
  'gita_18_16': 'This being so, the person who, owing to imperfect understanding, sees the Self as the sole agent, that person, of perverted intelligence, does not see truly.',
  'gita_18_17': 'One who is not attached to the ego and whose intelligence is not tainted, even though killing these people, does not slay and is not bound. The non-attached actor is not the doer in the meaningful sense.',
  'gita_18_18': 'Knowledge, the object of knowledge, and the knower form the threefold impulsion to action. The instrument, the action, and the agent form the threefold basis of action.',
  'gita_18_19': 'Knowledge, action, and agent are of three kinds in the doctrine of the gunas, according to their respective differences. Hear these also duly as they are.',
  'gita_18_20': 'That knowledge by which the one imperishable being is seen in all beings, undivided in the divided: know that knowledge to be sattvic.',
  'gita_18_21': 'But that knowledge which sees in all beings the manifold entities of distinct kinds, different from one another: know that knowledge to be rajasic.',
  'gita_18_22': 'But that which clings to one effect as if it were all, without concern for the cause, without grasping the truth, is called tamasic.',
  'gita_18_23': 'Action that is regulated, performed without attachment, without like and dislike, and without desire for fruit, is called sattvic.',
  'gita_18_24': 'But action that is performed with great effort by one who seeks to satisfy desires, or performed with sense of ego, is called rajasic.',
  'gita_18_25': 'Action that is undertaken out of delusion, without regard for capacity, consequences, or harm to others, is called tamasic.',
  'gita_18_26': 'The agent who is free from attachment, who does not speak about the ego, who is endowed with steadiness and enthusiasm, and who is not moved by success or failure: such an agent is called sattvic.',
  'gita_18_27': 'The agent who is passionate, who desires the fruits of action, who is greedy, harmful, impure, and who is moved by joy and grief, is called rajasic.',
  'gita_18_28': 'The agent who is undisciplined, vulgar, stubborn, deceitful, malicious, lazy, dejected, and procrastinating, is called tamasic.',
  'gita_18_29': 'Hear the threefold distinction of intelligence and also of steadiness, according to the gunas, which I will declare completely and separately, O Dhanamjaya.',
  'gita_18_30': 'The intelligence that knows activity and rest, what should be done and what should not be done, fear and fearlessness, bondage and liberation: that is sattvic, O Arjuna.',
  'gita_18_31': 'The intelligence by which one incorrectly understands dharma and adharma, and what should be done and what should not be done: that is rajasic, O Arjuna.',
  'gita_18_32': 'The intelligence which, enveloped in darkness, conceives adharma as dharma, and sees all things reversed: that is tamasic, O Arjuna.',
  'gita_18_33': 'The steadiness with which one holds the mind, vital breaths, and senses in yoga through unwavering practice: that is sattvic, O Arjuna.',
  'gita_18_34': 'But the steadiness with which one holds fast to dharma, pleasure, and wealth, with attachment desiring the fruit: that is rajasic, O Arjuna.',
  'gita_18_35': 'The steadiness by which a dull person does not give up sleep, fear, grief, depression, and intoxication: that is tamasic, O Arjuna.',
  'gita_18_36': 'Hear from Me, O best of Bharatas, also the threefold happiness. The happiness in which a person delights through practice, and in which one comes to the end of sorrow.',
  'gita_18_37': 'That which is like poison in the beginning but in the end like amrita, which arises from the serenity of the Self: that happiness is called sattvic.',
  'gita_18_38': 'That happiness which arises from the contact of the senses with their objects, which is like amrita in the beginning but poison in the end: that is called rajasic.',
  'gita_18_39': 'That happiness which in the beginning and afterward is self-delusion arising from sleep, laziness, and negligence: that is declared to be tamasic.',
  'gita_18_40': 'There is no being on earth or among the gods in heaven that is free from these three qualities born of prakriti. The three gunas cover all of existence without exception.',
  'gita_18_41': 'The duties of Brahmins, Kshatriyas, Vaishyas, and also Shudras are distributed according to the qualities born of their own nature, O scorcher of foes.',
  'gita_18_42': 'Tranquility, self-restraint, austerity, purity, patience, uprightness, knowledge, realization, and faith in God are the natural duty of the Brahmin.',
  'gita_18_43': 'Valor, splendor, steadfastness, skill, not fleeing in battle, generosity, and leadership: these are the natural duty of the Kshatriya.',
  'gita_18_44': 'Agriculture, cow-herding, and trade are the natural duty of the Vaishya. Service is the natural duty of the Shudra. The list of duties in 18.42-44 describes natural vocations rooted in character, not permanent social castes.',
  'gita_18_45': 'By being devoted to one\'s own natural duty one attains perfection. Hear how one who is devoted to one\'s own duty attains perfection.',
  'gita_18_46': 'From whom all beings proceed, by whom all this is pervaded: by worshipping Him through one\'s own duty, a person attains perfection. Any genuine work done as worship reaches the divine.',
  'gita_18_47': 'Better is one\'s own duty, though imperfect, than the well-performed duty of another. One who performs the action prescribed by one\'s own nature does not incur sin. The principle of svadharma returns at the close of the chapter.',
  'gita_18_48': 'One should not abandon the natural duty even if it is defective, O son of Kunti. For all undertakings are covered by defects as fire is by smoke.',
  'gita_18_49': 'One whose intellect is unattached everywhere, who has subdued the Self, whose desires have departed, reaches the supreme state of freedom from action through renunciation.',
  'gita_18_50': 'Learn from Me briefly how one who has attained perfection reaches Brahman, the highest state of knowledge.',
  'gita_18_51': 'Disciplined in intellect, having controlled the self, having abandoned sound and other sense objects, and having put aside attraction and aversion.',
  'gita_18_52': 'Resorting to solitude, eating lightly, controlling speech, body, and mind, always engaged in yoga meditation, taking refuge in dispassion.',
  'gita_18_53': 'Having relinquished ego, power, pride, desire, anger, and possessiveness, free from the sense of "mine," peaceful, one is fit to become Brahman.',
  'gita_18_54': 'Having become Brahman, serene in the Self, one neither grieves nor desires. Equal toward all beings, one attains supreme devotion to Me. The arrival at Brahman is not the end; it opens into devotion.',
  'gita_18_55': 'Through devotion one knows Me in truth, what My measure is and who I am. Then, having known Me in truth, one enters into Me at once.',
  'gita_18_56': 'Always performing all actions, taking refuge in Me, by My grace one obtains the eternal, the imperishable state. The imperishable state is reached not by stopping action but by doing all action in surrender.',
  'gita_18_57': 'Surrendering all actions to Me mentally, intent on Me as the highest, resorting to the yoga of intellect, always keep the mind fixed on Me.',
  'gita_18_58': 'Fixing the mind on Me, you will cross over all difficulties by My grace. But if out of ego you do not hear, you will perish.',
  'gita_18_59': 'If, resorting to ego, you think "I will not fight," your resolve is futile. Your nature will compel you. The ego\'s refusal cannot override the deeper current of svadharma.',
  'gita_18_60': 'Bound by your own action born of your own nature, that which from delusion you wish not to do, you will do even that, helplessly, O son of Kunti.',
  'gita_18_61': 'The Lord dwells in the hearts of all beings, O Arjuna, causing all beings to revolve by His maya, as if mounted on a machine.',
  'gita_18_62': 'Flee to Him alone for refuge with your entire being, O Bharata. By His grace you will obtain supreme peace and the eternal state.',
  'gita_18_63': 'Thus this knowledge, which is more secret than all secrets, has been declared to you by Me. Reflecting on this fully, act as you choose.',
  'gita_18_64': 'Hear again My supreme word, the most secret of all. Because you are deeply loved by Me, I will tell you what is good for you.',
  'gita_18_65': 'Fix your mind on Me, be devoted to Me, worship Me, bow to Me. So you will come to Me, I promise you truly, for you are dear to Me.',
  // Skipping gita_18_66 (already explained)
  'gita_18_67': 'This should never be spoken by you to one who is not austere, or who has no devotion, or who does not serve, or who speaks ill of Me. The teaching has a guardian: it is not for those who would diminish or trivialize it.',
  'gita_18_68': 'Whoever shall teach this supreme secret to My devotees, having shown the highest devotion to Me, shall come to Me without doubt.',
  'gita_18_69': 'There is no one among humans who does dearer service for Me than this one, nor shall there be any other dearer to Me on earth.',
  'gita_18_70': 'And the one who will study this righteous dialogue of ours, by that person I will be worshipped through the sacrifice of knowledge: this is My view.',
  'gita_18_71': 'And the person who hears this, even full of faith and free from malice, even that one, being liberated, will reach the auspicious worlds of the doers of righteous deeds.',
  'gita_18_72': 'Has this been heard by you, O Partha, with a focused mind? Has the delusion of your ignorance been destroyed, O Dhanamjaya? The question marks the completion of the teaching and invites Arjuna to report his own inner condition.',
  'gita_18_73': 'Arjuna says: my delusion is destroyed, I have regained memory through Your grace. I stand firm with doubts gone. I will do as You say. The four clauses describe the complete transformation: delusion gone, memory restored, doubt gone, will recovered.',
  'gita_18_74': 'Sanjaya reports: thus I heard this wonderful discourse between Vasudeva and the great-souled Arjuna, causing my hair to stand on end.',
  'gita_18_75': 'By the grace of Vyasa, I heard this supreme secret of yoga directly from Krishna the Lord of yoga, speaking in person. Sanjaya reminds Dhritarashtra that his ability to hear this dialogue was a gift from the sage Vyasa.',
  'gita_18_76': 'O king, remembering again and again this wonderful and holy dialogue of Krishna and Arjuna, I rejoice again and again.',
  'gita_18_77': 'And remembering again and again that most wonderful form of Hari, great is my wonder, O king. I rejoice again and again. Sanjaya\'s response is not intellectual but experiential: wonder and joy, again and again.',
  'gita_18_78': 'Wherever there is Krishna the Lord of yoga, and wherever there is Arjuna the great bowman, there is prosperity, victory, happiness, and firm resolve: this is my view. The Gita closes with Sanjaya\'s prophecy: the union of the divine and the human is the basis of all true flourishing.',
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

// Final check: which verses are still missing?
const missing = gita.verses.filter(v => !v.explanations || !v.explanations.en);
if (missing.length > 0) {
  console.log('\nMissing explanations for:', missing.map(v => v.id).join(', '));
} else {
  console.log('\nAll', gita.verses.length, 'verses now have English explanations.');
}

// Patches gita.json with explanations for Chapters 4-6.
// Style: no em-dashes, no filler, 2-4 sentences per verse.
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../assets/data/gita.json');
const gita = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

const explanations = {
  // CHAPTER 4 — Jnana Karma Sannyasa Yoga
  // Skipping gita_4_7 and gita_4_8 (already explained)
  'gita_4_1': 'Krishna reveals that he taught this imperishable yoga to the sun-god Vivasvan, who taught it to Manu, who taught it to Ikshvaku. The ancient lineage shows that the teaching is not new but has been repeatedly transmitted through devoted teachers.',
  'gita_4_2': 'The royal sages knew this yoga through succession. Over time it was lost due to the long span of ages. Now Krishna is declaring this ancient secret to Arjuna, who is both his devotee and friend.',
  'gita_4_3': 'Krishna is imparting this supreme secret because Arjuna is his devotee. The teaching is not to be distributed carelessly; its depth is best received by someone prepared by devotion and trust.',
  'gita_4_4': 'Arjuna raises a reasonable objection: Vivasvan was born before Krishna, so how could Krishna have taught him at the beginning? The question challenges Krishna on historical and metaphysical grounds.',
  'gita_4_5': 'Krishna answers: both he and Arjuna have had many past births. Krishna knows them all; Arjuna does not. This is not a boast but a statement about the nature of divine versus conditioned consciousness.',
  'gita_4_6': 'Though Krishna is unborn and his Self is imperishable, though he is the Lord of all beings, he comes into manifestation by his own maya, holding his own nature. The avatara doctrine is stated here: birth is real but not binding for Krishna.',
  'gita_4_9': 'One who truly understands Krishna\'s divine birth and action is not reborn after death but comes to Krishna. The understanding is not merely intellectual; it is the understanding that transforms the knower.',
  'gita_4_10': 'Freed from passion, fear, and anger, absorbed in Me, taking refuge in Me, purified by the fire of wisdom, many have come to my state of being. The path is described through three freedoms and two acts of turning toward Krishna.',
  'gita_4_11': 'In whatever way people approach Me, I welcome them in that same way. All people are following My path in every direction. The teaching here is that all genuine spiritual approaches ultimately converge on the same reality.',
  'gita_4_12': 'Those who desire the fruit of actions sacrifice to the gods in this world, and success from action quickly comes to them. Quick results are available through the path of the gods, but those results are finite and rebirth follows.',
  'gita_4_13': 'The fourfold order of varna was created by Krishna according to the distinctions of quality and action. Though he is the creator of this order, he is not its agent, being unchangeable and actionless.',
  'gita_4_14': 'Actions do not taint Krishna because he has no desire for the fruits of actions. One who understands this truly is not bound by action either. The freedom of the knower mirrors the freedom of the Lord.',
  'gita_4_15': 'Ancient seekers of liberation performed action knowing this truth. Therefore Arjuna should also perform action as the ancients performed it in the past. The continuity with tradition is itself a source of authority.',
  'gita_4_16': 'Even the wise are confused about what is action and what is inaction. Krishna will teach Arjuna about action so that Arjuna may be liberated from evil. The teaching of karma is more subtle than it first appears.',
  'gita_4_17': 'One must understand action (karma), wrong action (vikarma), and inaction (akarma). The nature of action is deep and difficult to understand. These three categories are the subject of the next several verses.',
  'gita_4_18': 'The one who sees inaction in action, and action in inaction, is wise among humans and is a yogi who has accomplished all action. The paradox here is at the heart of karma yoga: acting without acting, from the standpoint of the Self.',
  'gita_4_19': 'The wise call someone a pandit whose every undertaking is free from desire and motive, whose actions are burned up in the fire of wisdom. The criterion is interior, not the presence or absence of visible action.',
  'gita_4_20': 'Having abandoned all attachment to the fruits of action, always content and independent, even though engaged in action, such a person does nothing at all. Independence from results is the basis of genuine freedom in action.',
  'gita_4_21': 'Without expectation, with thought and self restrained, having abandoned all sense of ownership, doing only bodily action, such a person does not incur sin. The minimal action of the liberated is still action but carries no binding force.',
  'gita_4_22': 'Content with what comes unsought, having moved beyond the pairs of opposites, free from envy, equal in success and failure, such a person is not bound even by performing actions.',
  'gita_4_23': 'For a person who is liberated, without attachment, whose mind is established in wisdom, who acts only as sacrifice, the entire activity dissolves. When all action is offered as sacrifice, no residue of karma accumulates.',
  'gita_4_24': 'The act of offering is Brahman, the oblation is Brahman, poured into the fire which is Brahman by the person who is Brahman. Brahman is to be reached by the one who meditates on Brahman in the act. Every part of the sacrificial act is revealed as non-dual.',
  'gita_4_25': 'Some yogis worship the gods with sacrifice. Others offer the sacrifice itself as sacrifice into the fire of Brahman. Both paths lead toward the same ultimate reality; only the emphasis differs.',
  'gita_4_26': 'Others offer hearing and other senses into the fires of restraint. Others offer sound and other objects of the senses into the fires of the senses. The metaphor of sacrifice is extended: anything can be offered.',
  'gita_4_27': 'Others offer all the functions of the senses and the functions of the vital breath into the fire of the yoga of self-restraint, kindled by knowledge. The yogi offers the entire inner life as an act of surrender.',
  'gita_4_28': 'Others offer wealth, austerity, or yoga as sacrifice. Others of controlled vows and firm resolve offer study of scripture and knowledge as sacrifice. The variety of valid sacrifice-forms is deliberately broad.',
  'gita_4_29': 'Others pour the outgoing breath into the incoming, and the incoming into the outgoing, arresting the movement of both by practicing pranayama. The breath becomes the medium of internal sacrifice.',
  'gita_4_30': 'Others, who restrict their food, pour the vital breaths into vital breaths. All of these are knowers of sacrifice whose sins are destroyed by sacrifice.',
  'gita_4_31': 'Those who eat the nectar remaining from sacrifice go to the eternal Brahman. This world is not for the one who does not sacrifice. What of the other worlds? The verse stresses that sacrifice is the basis of all genuine flourishing.',
  'gita_4_32': 'Many forms of sacrifice are spread out before Brahman. Know that all of them are born from action. Knowing this, you will be liberated. Behind every ritual form is the single principle of conscious offering.',
  'gita_4_33': 'The sacrifice of knowledge is superior to the sacrifice of material objects. All action without exception, O Arjuna, culminates in knowledge. The direction of all karma yoga is toward jnana.',
  'gita_4_34': 'Learn this by prostration, by question, by service. The wise who have realized the truth will teach you knowledge. The three acts described here define the proper relationship between student and teacher.',
  'gita_4_35': 'Having known this, you will not be deluded again in this way. By this knowledge you will see all beings without exception in the Self, and then in Me. The vision of unity is the fruit of genuine knowledge.',
  'gita_4_36': 'Even if you are the most sinful of all sinners, you will cross over all sin by the boat of knowledge alone. The absoluteness of the claim matches the absoluteness of knowledge: it overrides all past karma.',
  'gita_4_37': 'As a fire reduces kindling to ashes, so the fire of knowledge reduces all karma to ashes. Knowledge destroys even the residue of karma already accumulated.',
  'gita_4_38': 'There is nothing as purifying as knowledge in this world. One who is perfected by yoga finds this within themselves in time. The finding is described as an interior discovery, not an external acquisition.',
  'gita_4_39': 'The person of faith obtains knowledge, having devoted himself to it and restrained his senses. Having obtained knowledge, he quickly attains supreme peace. Faith, effort, and sense-restraint together produce the result.',
  'gita_4_40': 'The ignorant person, the faithless person, and the doubting person perish. For the doubting person there is neither this world nor the next, nor any happiness. Doubt, unlike honest questioning, is a permanent suspension that prevents any action.',
  'gita_4_41': 'Actions do not bind one who has renounced all actions in yoga, who has cut doubt by knowledge, and who is established in the Self. O Dhanamjaya, actions do not bind such a person.',
  'gita_4_42': 'Therefore, cutting this doubt born of ignorance that dwells in your heart with the sword of knowledge, resort to yoga. Arise, O Bharata. The chapter ends with a direct command, returning to the battlefield with new clarity.',

  // CHAPTER 5 — Karma Sannyasa Yoga
  'gita_5_1': 'Arjuna asks Krishna to give him a definitive answer: is renunciation of action better, or is action itself the path? Both have been praised and he is genuinely confused about which to practice.',
  'gita_5_2': 'Krishna answers that both renunciation and karma yoga lead to the highest good, but karma yoga is superior to renunciation of action. The distinction matters because Arjuna is a warrior, not a monk.',
  'gita_5_3': 'The one who neither hates nor desires should be known as a perpetual renunciant. Free from duality, such a person is easily liberated from bondage. True renunciation is an inner condition, not necessarily a change of lifestyle.',
  'gita_5_4': 'Children, not the wise, speak of Sankhya and yoga as distinct. One who is rightly established in either obtains the fruit of both. The paths differ in emphasis, not in destination.',
  'gita_5_5': 'The state reached by Sankhya is also reached by yoga. Sankhya and yoga are one. One who sees this truly, sees. The insight is that discrimination (Sankhya) and action (yoga) are two expressions of the same path.',
  'gita_5_6': 'Renunciation is difficult to achieve without yoga. The sage disciplined by yoga quickly attains Brahman. Without the inner discipline that yoga provides, mere formal renunciation produces nothing.',
  'gita_5_7': 'Disciplined in yoga, with a pure self, with the self conquered, with the senses conquered, whose self has become the Self of all beings, such a person is not tainted though acting.',
  'gita_5_8': 'The knower of truth, although seeing, hearing, touching, smelling, eating, going, sleeping, breathing, does not think "I do." The sense-functions happen, but the knower knows they are not the doer.',
  'gita_5_9': 'Speaking, giving, receiving, opening and closing the eyes: the yogi holds that the senses are engaged among sense-objects. The same principle from 5.8 is extended to speech and voluntary acts.',
  'gita_5_10': 'One who acts with all actions abandoned to Brahman, giving up attachment, is not tainted by sin, as a lotus leaf is not wetted by water. The lotus simile describes complete non-attachment in contact with the world.',
  'gita_5_11': 'Yogis perform action with the body, mind, intellect, and even the senses, abandoning attachment, for the sake of self-purification. The instruments are used, but the motive is purification, not acquisition.',
  'gita_5_12': 'The disciplined one, having abandoned the fruit of action, attains steady peace. The undisciplined one, attached to the fruit, is bound by desire-driven action. The single difference in orientation produces profoundly different outcomes.',
  'gita_5_13': 'The embodied one having mentally renounced all actions dwells happily as the ruler in the nine-gated city, neither acting nor causing action. The body is the city; the Self rules it without being bound by it.',
  'gita_5_14': 'The Lord creates neither the sense of agency nor the actions nor the union with the fruits of action. It is one\'s own nature that proceeds. The created order runs on its own logic; the Atman is not a cause within that logic.',
  'gita_5_15': 'The All-pervading One does not receive the sin or merit of anyone. Knowledge is covered by ignorance and thereby beings are deluded. Sin and merit belong to the world of conditioned beings, not to Brahman.',
  'gita_5_16': 'But for those whose ignorance is destroyed by knowledge of the Self, that knowledge illuminates the Supreme like the sun. When ignorance is removed, the Self reveals itself without any additional effort.',
  'gita_5_17': 'With the intellect absorbed in That, with the self absorbed in That, established in That, devoted to That, going to a state of non-return, their sins shaken off by knowledge.',
  'gita_5_18': 'The wise see with equality a learned Brahmin, a cow, an elephant, a dog, and a dog-eater. The vision of the same Self in all is the practical expression of the knower\'s realized understanding.',
  'gita_5_19': 'Even here in this world those whose mind rests in equality have overcome the cycle of birth. Brahman is without flaw and equal; therefore they abide in Brahman. The equality of mind is not the cause but the expression of abiding in Brahman.',
  'gita_5_20': 'One should not rejoice having obtained what is pleasant, nor become disturbed having obtained what is unpleasant. With steady mind, undeluded, knowing Brahman, one is established in Brahman.',
  'gita_5_21': 'The one whose self is unattached to external contacts finds the joy that is in the Self. With the self joined to Brahman in yoga, such a person enjoys imperishable happiness.',
  'gita_5_22': 'The pleasures that are born of external contact are sources of sorrow. They have a beginning and an end. The wise do not rejoice in them. The observation is empirical: pleasures tied to conditions always end.',
  'gita_5_23': 'One who can withstand here in this world, before liberation from the body, the agitation born of desire and anger, that one is a yogi and a happy person. The test of liberation is not future; it is present.',
  'gita_5_24': 'The one who has inner happiness, whose inner delight is in the Self, and who has inner light is a yogi. Such a person, having become Brahman, attains Brahman-nirvana.',
  'gita_5_25': 'The seers obtain Brahman-nirvana, those whose sins are destroyed, whose doubts are severed, who are self-controlled, who delight in the welfare of all beings.',
  'gita_5_26': 'Brahman-nirvana exists on both sides for the self-controlled ascetics who are free from desire and anger, who are self-aware. No future rebirth is implied; liberation is not deferred.',
  'gita_5_27': 'Shutting out all external contacts, fixing the vision between the eyebrows, equalizing the ingoing and outgoing breaths moving within the nostrils. This verse begins a description of meditative technique.',
  'gita_5_28': 'With the senses, mind, and intellect controlled, intent on liberation, free from desire, fear, and anger, the sage who is always liberated is indeed liberated. The conditions are inner; the result is immediate.',
  'gita_5_29': 'Knowing Me as the recipient of sacrifice and austerity, the Great Lord of all worlds, the friend of all beings, one attains peace. Chapter 5 closes by returning to Krishna as the experiential ground of liberation.',

  // CHAPTER 6 — Dhyana Yoga
  'gita_6_1': 'Krishna defines a true renunciant and yogi as one who performs prescribed duty without dependence on the fruit of action, not as one who has abandoned fire and ritual. The outer sign does not define the inner reality.',
  'gita_6_2': 'What is called renunciation (sannyasa) should be understood as yoga. No one becomes a yogi without renouncing selfish purpose. The reframing shows that karma yoga and sannyasa are the same thing at the level of intention.',
  'gita_6_3': 'For the sage wishing to ascend to yoga, action is said to be the means. For one who has already attained yoga, serenity (shama) is said to be the means. The path changes as the practitioner changes.',
  'gita_6_4': 'When a person is attached neither to sense objects nor to actions, having renounced all purpose, then he is said to have ascended to yoga. The arrival at yoga is defined negatively: no binding desires remain.',
  'gita_6_5': 'Let a person raise the self by the Self; let the self not be degraded. The self alone is the friend of the self, and the self alone is the enemy of the self. The verse identifies the self as both the agent of liberation and the source of bondage.',
  'gita_6_6': 'The self is the friend of the self for one who has conquered the self by the Self. But for one who has not controlled the self, the self acts as an enemy, like an external foe.',
  'gita_6_7': 'The Self of the self-conquered and serene one is completely concentrated in cold and heat, pleasure and pain, honor and dishonor. The yogi is not indifferent to these pairs but is not controlled by them.',
  'gita_6_8': 'The yogi whose self is satisfied with knowledge and discrimination, who stands on the summit, who has controlled the senses, for whom a clod of earth, a stone, and gold are equal, is said to be in yoga.',
  'gita_6_9': 'One who is equal-minded toward friend, ally, foe, bystander, mediator, the hateful and the relative, toward the righteous and the sinful alike, excels. Moral and social categories dissolve in the vision of the yogi.',
  'gita_6_10': 'The yogi should always engage in yoga, remaining in a solitary place, alone, with mind and body restrained, without expectations and without possessions. The conditions described here are for the meditator beginning practice.',
  'gita_6_11': 'The yogi should establish a firm seat in a clean place, not too high and not too low, covered with kusha grass, a deerskin, and a cloth, one over the other. These classical instructions ground the practice in the physical.',
  'gita_6_12': 'Seated there, making the mind one-pointed, with the activities of mind and senses restrained, the yogi should practice yoga for purification of the self.',
  'gita_6_13': 'Holding the body, head, and neck erect and still, gazing at the tip of the nose, not looking around in any direction. The physical posture described supports the interior stillness.',
  'gita_6_14': 'With a serene and fearless mind, firm in the vow of celibacy, with the mind controlled, with thought on Me, the yogi should sit, devoted to Me. The practice converges on devotion to Krishna.',
  'gita_6_15': 'The yogi, always disciplining the mind in this way, with the mind restrained, attains peace, the highest nirvana which rests in Me. The endpoint of meditation practice is described as peace rooted in Krishna.',
  'gita_6_16': 'Yoga is not for one who eats too much or too little, nor for one who sleeps too much or too little. The middle path is not asceticism; it is balance.',
  'gita_6_17': 'For one who is regulated in eating and recreation, who performs actions in a balanced way, who is regulated in sleep and waking, yoga removes sorrow.',
  'gita_6_18': 'When the disciplined mind rests in the Self alone, free from yearning for all objects of desire, then it is said to be in yoga. The test of arrival in yoga is freedom from craving, not intensity of concentration.',
  'gita_6_19': 'As a lamp in a windless place does not flicker, such is the image given for the disciplined mind of the yogi practicing meditation on the Self. The lamp is the classic simile for the still mind.',
  'gita_6_20': 'Where the mind, restrained by yoga practice, becomes quiet; where, seeing the Self by the Self, one is satisfied in the Self. The moment of samadhi is described here as the Self recognizing itself.',
  'gita_6_21': 'Where one knows that endless happiness which is grasped by the intellect beyond the senses, and where, established, one does not move from the truth. The happiness of samadhi is qualitatively different from sense-pleasure.',
  'gita_6_22': 'Established in it, one is not moved even by great sorrow. That is what is called yoga: disjunction from the conjunction of sorrow. The yogic state is defined by the dissolution of the pain-pleasure cycle.',
  'gita_6_23': 'This yoga should be practiced with determination and with an undiscouraged mind. The word for determination here (nishchayena) implies sustained resolve over time, not a single moment of intensity.',
  'gita_6_24': 'Completely abandoning all desires born of imagination, restraining the entire group of senses from all sides by the mind alone. The practice involves radical disengagement from the projections of the desiring mind.',
  'gita_6_25': 'Little by little one should come to rest, with the intellect held firm. Having established the mind in the Self, one should not think of anything else. The gradualism here is practical guidance: force does not work.',
  'gita_6_26': 'From wherever the unsteady and unstable mind wanders, one should bring it back and establish it under the control of the Self alone. No impatience; just return. The practice of return is itself the practice.',
  'gita_6_27': 'Supreme happiness comes to this yogi whose mind is peaceful, whose passion is quieted, who is without sin, who has become Brahman. The qualities described are the natural outcome of the practice, not conditions imposed on it.',
  'gita_6_28': 'The yogi who is always disciplining the self in this way, free from sin, easily attains the endless happiness of contact with Brahman.',
  'gita_6_29': 'With the self disciplined in yoga, with equal vision everywhere, one sees the Self in all beings and all beings in the Self. The expansion of vision is the fruit of inner practice.',
  'gita_6_30': 'For one who sees Me everywhere and sees everything in Me, I am not lost and that person is not lost to Me. The mutual recognition between the devotee and Krishna is described as a permanent state.',
  'gita_6_31': 'The yogi who, established in oneness, worships Me who dwell in all beings, in whatever way he lives, lives in Me. Action and residence in Me are compatible; the inner orientation is what matters.',
  'gita_6_32': 'The one who sees by analogy with the self, pleasure and pain as equal everywhere, that yogi is deemed highest by Me. The equality of empathy is described: the yogi feels others\' pleasure and pain as one\'s own and responds accordingly.',
  'gita_6_33': 'Arjuna objects that the yoga of equanimity described by Krishna seems unsteady, since the mind is so restless. He is not being negative; he is being honest about the difficulty.',
  'gita_6_34': 'The mind is unsteady, turbulent, strong, and unyielding, O Krishna. To control it seems as difficult as controlling the wind. Arjuna\'s simile of the wind captures the sense of futility anyone who has tried meditation knows.',
  'gita_6_35': 'Krishna agrees: the mind is undoubtedly difficult to curb. But, O Arjuna, it can be restrained by practice (abhyasa) and detachment (vairagya). The teaching gives two tools, not a promise that it is easy.',
  'gita_6_36': 'Yoga is hard to attain for one of uncontrolled self. But for one who strives through proper means with the self controlled, it is possible to attain. The condition is not talent but the proper kind of effort.',
  'gita_6_37': 'Arjuna asks: the person who is faithful but not striving, whose mind has drifted from yoga, who has failed to achieve perfection in yoga, what is their destination? The question is existential: what happens to the sincere person who fails?',
  'gita_6_38': 'Does the fallen yogi, having strayed from both paths (of action and wisdom), perish like a torn cloud? Is there no firm ground for such a person? Arjuna presses the question with the image of a cloud torn from both sky and earth.',
  'gita_6_39': 'This doubt of mine, O Krishna, please resolve completely. No one other than You can resolve this doubt. The appeal is not flattery but recognition that only a teacher who knows can answer a question about what cannot be directly observed.',
  'gita_6_40': 'Krishna answers firmly: neither here nor in the hereafter is there destruction for such a person. No one who does good goes to ruin, my son. The words "my son" convey the warmth behind the assurance.',
  'gita_6_41': 'Having attained the worlds of the meritorious, and having dwelt there for many years, the fallen yogi is then born into a house of the pure and prosperous. The failed yogi is not lost but continues in a next life with advantages.',
  'gita_6_42': 'Or the yogi is born into a family of wise yogis. Such a birth in this world is very difficult to obtain. The rarity of the birth points to its value as a platform for practice.',
  'gita_6_43': 'There one inherits the yoga-intelligence of previous births and strives from that point toward perfection. The accumulated insight carries forward. No effort in yoga is ever wasted.',
  'gita_6_44': 'By that previous practice alone the yogi is carried forward even unwillingly. Even the seeker of yoga goes beyond the word-Brahman (the Vedic rewards). The momentum of past practice is a real force in the current life.',
  'gita_6_45': 'The yogi who strives with effort, purified of sins, perfected through many births, then attains the highest goal. Liberation is not always the work of one lifetime; it can span many.',
  'gita_6_46': 'The yogi is considered greater than ascetics, greater than those who are learned, greater than those who perform ritual action. Therefore be a yogi, O Arjuna. The yogi surpasses even the most committed practitioners of other paths.',
  'gita_6_47': 'Among all yogis, the one who has gone to Me with inner self, who worships Me with faith and devotion, I consider to be the most absorbed in yoga. The chapter ends by identifying devotion to Krishna as the culmination of all yoga.',
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

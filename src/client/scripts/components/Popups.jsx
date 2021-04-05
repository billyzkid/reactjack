import React, { Fragment, useState, useRef, useCallback, useMemo } from 'react';
import Popup from './Popup.jsx';
import { useStateContext, useDispatchContext } from '../hooks.js';
import { getClassNames, getNumberOrString, groupChatMessages, handleEnterKeyDown } from '../utils.js';
import { logger } from '../log.js';
import * as constants from '../constants.js';

Popup.ariaHiddenSelector = '.app';

const InfoPopup = (props) => {
  logger.debug('InfoPopup render', props);

  const { isInfoPopupOpen } = useStateContext();
  const dispatch = useDispatchContext();

  const onRequestClose = useCallback(() => dispatch({ type: 'toggleInfoPopup', isOpen: false }), []);

  // allows popup to be memoized
  const children = useMemo(() => (
    <Fragment>
      <h1 id="blackjack-rules-of-the-game">Blackjack: Rules of the Game</h1>
      <p>Adapted from <a href="https://www.blackjackinfo.com/blackjack-rules/" target="_blank">https://www.blackjackinfo.com/blackjack-rules/</a></p>
      <h2 id="table-of-contents">Table of Contents</h2>
      <ul>
        <li><a href="#part-1-blackjack-basics">Part 1 – Blackjack Basics</a></li>
        <ul>
          <li><a href="#premise-of-the-game">Premise of the Game</a></li>
          <li><a href="#values-of-the-cards">Values of the Cards</a></li>
          <li><a href="#the-deal-of-the-cards">The Deal of the Cards</a></li>
          <li><a href="#how-the-dealer-plays-his-hand">How the Dealer Plays His Hand</a></li>
          <li><a href="#wins-losses-and-ties">Wins, Losses, and Ties</a></li>
          <li><a href="#what-is-a-blackjack-or-natural">What is a Blackjack, or Natural?</a></li>
        </ul>
        <li><a href="#part-2-player-choices">Part 2 – Player Choices</a></li>
        <ul>
          <li><a href="#hitting-and-standing">Hitting and Standing</a></li>
          <li><a href="#doubling-down">Doubling Down</a></li>
          <li><a href="#splitting-pairs">Splitting Pairs</a></li>
          <li><a href="#resplitting">Resplitting</a></li>
          <li><a href="#splitting-tens">Splitting Tens</a></li>
          <li><a href="#splitting-aces">Splitting Aces</a></li>
        </ul>
        <li><a href="#part-3-basic-strategy">Part 3 – Basic Strategy</a></li>
        <ul>
          <li><a href="#when-to-hit-or-stand-in-blackjack">When to Hit or Stand in Blackjack</a></li>
          <li><a href="#when-to-double-in-blackjack">When to Double in Blackjack</a></li>
          <li><a href="#when-to-split-in-blackjack">When to Split in Blackjack</a></li>
        </ul>
        <li><a href="#part-4-insurance-and-surrender">Part 4 – Insurance and Surrender</a></li>
        <ul>
          <li><a href="#insurance">Insurance</a></li>
          <li><a href="#taking-even-money-on-blackjack">Taking "Even Money" on Blackjack</a></li>
          <li><a href="#surrender">Surrender</a></li>
        </ul>
        <li><a href="#part-5-rule-variations">Part 5 – Rule Variations</a></li>
        <ul>
          <li><a href="#dealer-hits-soft-17">Dealer Hits Soft 17</a></li>
          <li><a href="#double-after-split">Double After Split</a></li>
          <li><a href="#resplitting-aces">Resplitting Aces</a></li>
          <li><a href="#peek-or-no-peek-hole-card-or-no-hole-card">Peek or No Peek, Hole Card or No Hole Card</a></li>
          <li><a href="#the-five-card-charlie">The Five Card Charlie</a></li>
        </ul>
        <li><a href="#faq">FAQ</a></li>
        <ul>
          <li><a href="#do-the-suits-of-the-cards-make-a-difference">Do the suits of the cards make a difference?</a></li>
          <li><a href="#is-counting-cards-legal">Is counting cards legal?</a></li>
          <li><a href="#whats-next">What's next?</a></li>
        </ul>
      </ul>
      <h2 id="part-1-blackjack-basics">Part 1 – Blackjack Basics</h2>
      <h3 id="premise-of-the-game">Premise of the Game</h3>
      <p>Blackjack is pretty simple. The basic premise of the game is that you want to have a hand value that is closer to 21 than that of the dealer, without going over 21. Other players at the table are of no concern. Your hand competes only against the hand of the dealer.</p>
      <p>The rules of play for the dealer are strictly dictated, leaving no decisions up to the dealer. Therefore, there is no problem with the dealer or any of the other players at the table seeing the cards in your hand. In fact, if you're playing at a shoe game, the player cards are all dealt face up.</p>
      <h3 id="values-of-the-cards">Values of the Cards</h3>
      <p>In blackjack, the cards are valued as follows:</p>
      <ul>
        <li>An ace can count as either 1 or 11, as explained below.</li>
        <li>The cards from two through nine are valued at their face value.</li>
        <li>The ten, jack, queen, and king are all valued at 10.</li>
      </ul>
      <p>The suits of the cards do not have any meaning in the game. The value of a hand is simply the sum of the point counts of each card in the hand. Some examples:</p>
      <div className="hand">
        <div className="card five-of-clubs"></div>
        <div className="card seven-of-hearts"></div>
        <div className="card nine-of-diamonds"></div>
      </div>
      <p>5 + 7 + 9 = 21, so this hand has a value of 21.</p>
      <div className="hand">
        <div className="card jack-of-diamonds"></div>
        <div className="card ten-of-spades"></div>
      </div>
      <p>10 + 10 = 20, so this hand has a value of 20.</p>
      <div className="hand">
        <div className="card nine-of-spades"></div>
        <div className="card three-of-spades"></div>
        <div className="card queen-of-hearts"></div>
      </div>
      <p>9 + 3 + 10 = 22, so this hand is a "bust". Any hand that goes over 21 "breaks" or is "busted", and is an automatic loser.</p>
      <p>Pretty easy, eh?</p>
      <p>The ace adds a new twist…</p>
      <p>An ace can be counted as either 1 or 11. You need not specify which value the ace has. It is assumed to have the value that makes the best hand, and that may change as more cards are added to the hand.</p>
      <div className="hand">
        <div className="card ace-of-clubs"></div>
        <div className="card six-of-diamonds"></div>
      </div>
      <p>This hand is valued at 7 or 17, also known as a "soft" 17.</p>
      <p>A soft hand is any hand where an ace can be counted as either 1 or 11 without going over 21. The name reflects the fact that the hand can't bust if you draw another card. It's "soft".</p>
      <p>Let's draw another card:</p>
      <div className="hand">
        <div className="card ace-of-clubs"></div>
        <div className="card six-of-diamonds"></div>
        <div className="card king-of-spades"></div>
      </div>
      <p>Now our hand is 17, since 1 + 6 + 10 = 17. We no longer have the option to count the ace as 11, because that would go over 21. (This hand is now a "hard" 17, despite having an ace in it.)</p>
      <p>Let's back up, and draw a different card instead:</p>
      <div className="hand">
        <div className="card ace-of-clubs"></div>
        <div className="card six-of-diamonds"></div>
        <div className="card three-of-diamonds"></div>
      </div>
      <p>Now our hand is "10 or 20", a soft 20. Twenty is a great hand, so we would stop there.</p>
      <h3 id="the-deal-of-the-cards">The Deal of the Cards</h3>
      <p>Once all the bets are placed, the dealer will deal the cards to the players. He will make two passes around the table starting at his left (your right) so that the players and the dealer all have two cards each. The dealer will flip one of his cards over, exposing its value as the "dealer upcard".</p>
      <p>Once the initial hands are dealt, play proceeds around the table starting at the first seat to the dealer's left, also called "first base". Each player in turn indicates to the dealer how he wishes to play the hand as explained in the <a href="#part-2-player-choices">next part</a> of this article.</p>
      <p>After all of the players have finished their hands, the dealer will complete his hand, and then pay the winning bets and collect the losing bets.</p>
      <h3 id="how-the-dealer-plays-his-hand">How the Dealer Plays His Hand</h3>
      <p>The dealer will first flip over the "hole card" to reveal his two-card starting hand. The dealer is then required to play his hand in a very specific way, with no choices allowed.</p>
      <p>He must draw cards until he has a total of 17 or more. The dealer has no choice in how to play the hand. He must continue taking cards until his total is at least 17. (A slight variation of this rule is discussed below.)</p>
      <p>Let's look at one possible dealer hand:</p>
      <div className="hand">
        <div className="card ace-of-clubs"></div>
        <div className="card five-of-hearts"></div>
        <div className="card seven-of-diamonds"></div>
        <div className="card six-of-clubs"></div>
      </div>
      <p>After flipping over the hole card, the dealer's hand was (A,5). That makes a hand value of 16, so he must draw another card.</p>
      <p>He drew a seven, making the hand value 13 (the ace can no longer be counted as 11). With a total of 13, he must hit again.</p>
      <p>He drew a six, making the hand value 19. Since that is "17 or more", the dealer stops with a final total of 19.</p>
      <h3 id="wins-losses-and-ties">Wins, Losses, and Ties</h3>
      <p>Once the hand is over, how does the dealer decide which bets to pay, and which bets to collect?</p>
      <p>If you draw a card that makes your hand total go over 21, your hand is a bust. That is an automatic loser. The dealer will immediately collect your bet, and discard your hand.</p>
      <p>Assuming you did not bust, the dealer will play out his hand at the end. If he busts by going over 21, all the remaining players win their bets.</p>
      <p>If neither you nor the dealer busted, now the dealer will compare his final total to yours.</p>
      <p>If his total is higher than yours, you lose, and he will collect your bet.</p>
      <p>If your total is higher than his, you win, and he will pay the entire amount you have bet. After he pays you, you'll have your initial bet plus the amount you won.</p>
      <p>So, what happens if you and the dealer tie, with the same exact total? Nothing at all. A tie is called a "push", and you do not win or lose your bet.</p>
      <h3 id="what-is-a-blackjack-or-natural">What is a Blackjack, or Natural?</h3>
      <p>A blackjack, or natural, is a total of 21 in your first two cards. A blackjack is therefore an ace and any 10-valued card, with the additional requirement that these be your first two cards. If you split a pair of aces for example, and then draw a 10-valued card on one of the aces, this is not a blackjack, but rather a total of 21.</p>
      <p>The distinction is important, because a winning blackjack pays the player at 3 to 2. A bet of $10 wins $15 if the player draws a blackjack. A player blackjack beats any dealer total other than blackjack, including a dealer's three-or-more-card 21. If both a player and the dealer have blackjack, the hand is a push.</p>
      <p>In a casino, the dealer will usually pay your winning blackjack bet immediately when it is your turn to play. In the face down games, this means that you should show the blackjack to the dealer at that time. Some casinos may postpone paying the blackjack until after the hand is over if the dealer has a ten card up and has not checked for a dealer blackjack. Other casinos check under both ten and ace dealer upcards, and would therefore pay the blackjack immediately.</p>
      <p>Regardless, when you are dealt a blackjack, turn the cards face up, and smile. It only happens about once every 21 hands, but it accounts for a lot of the fun of the game.</p>
      <h2 id="part-2-player-choices">Part 2 – Player Choices</h2>
      <h3 id="hitting-and-standing">Hitting and Standing</h3>
      <p>The most common decision a player must make during the game is whether to draw another card to the hand ("hit"), or stop at the current total ("stand").</p>
      <h3 id="doubling-down">Doubling Down</h3>
      <p>Much of the excitement and profit in blackjack comes from hands where you are able to "double down". This option is available only with a two-card hand, before another card has been drawn. Doubling down allows you to double your bet and receive one (and only one) additional card to your hand.</p>
      <p>A good example of a doubling opportunity is when you hold a total of 11, such as a (6,5) against a dealer's upcard of 5. In this case, you have a good chance of winning the hand by drawing one additional card, so you should increase your bet in this advantageous situation by doubling down.</p>
      <p>You are allowed to double down for any amount up to your original bet amount, so you could actually double down for less if you wanted. That's a bad move though. Remember that you do give up something for being allowed to increase your bet: the ability to draw more than one additional card. If the correct play is to double down, you should always double for the full amount if possible.</p>
      <h3 id="splitting-pairs">Splitting Pairs</h3>
      <p>When you are dealt a pair of cards of the same rank, you are allowed to split the pair into two separate hands and play them independently. Let's say you are dealt a pair of eights for a total of 16. Sixteen is the worst possible player hand, since it is unlikely to win as is, but is very likely to bust if you draw to it. Here's a great chance to improve a bad situation.</p>
      <p>You must place a matching bet on a split. Note this is unlike doubling down where you are allowed to bet less than your original bet.</p>
      <p>The dealer will separate the two cards, and treat them as two independent hands. He will deal a second card on the first eight, and you will play that two-card hand to completion.</p>
      <p>No matter what happens on your first hand, when you are done with it the dealer will deal a second card to your next hand and the process starts all over.</p>
      <h3 id="resplitting">Resplitting</h3>
      <p>If you get additional pairs in the first two cards of a hand, most casinos will allow you to resplit, making yet another hand. Typically a player is allowed to split up to 3 times, making 4 separate hands, with 4 separate bets. If double after split is allowed, you could have up to 8 times your initial bet on the table!</p>
      <h3 id="splitting-tens">Splitting Tens</h3>
      <p>Note that you are allowed to split any 10-valued cards, so you could split a (J, Q) hand. However, this is usually a bad play. Keep the 20. You will make more money on the pat 20 than you will trying to make two good hands from it.</p>
      <h3 id="splitting-aces">Splitting Aces</h3>
      <p>Another oddity comes when splitting aces. Splitting aces is a very strong player move so the casino limits you to drawing only one additional card on each ace. Also, if you draw a 10-valued card on one of your split aces, the hand is not considered a blackjack, but is instead treated as a normal 21, and therefore does not collect a 3:2 payoff.</p>
      <p>Some casinos allow resplitting aces if you draw another, but many do not.</p>
      <p>With all these limitations, you may wonder whether it makes sense to split aces. The answer is a resounding YES. Always split aces.</p>
      <h2 id="part-3-basic-strategy">Basic Strategy</h2>
      <p>If you want to win at blackjack, you will eventually need to learn Basic Strategy which determines the correct play for any hand versus the dealer upcard. However, there are some quick rules and tips that you can learn as a beginner to decrease the house edge and formulate a strategy.</p>
      <h3 id="when-to-hit-or-stand-in-blackjack">When to Hit or Stand in Blackjack</h3>
      <ul>
        <li><u>Never</u> hit a hard 17 or above.</li>
        <li><u>Never</u> stand on an 11 or lower.</li>
        <li><u>Never</u> hit a 12-16 against a dealer 4, 5 or ,6.</li>
        <li><u>Always</u> hit a 12-16 against a dealer 7 or higher.</li>
        <li><u>Always</u> hit on soft 17 or less.</li>
      </ul>
      <h3 id="when-to-double-in-blackjack">When to Double in Blackjack</h3>
      <p>Remember there are more 10-valued cards (10, J, Q, K) than any other cards in the deck — so when a 10-valued card will get you close to 21 and you are against a card that is bad for the dealer, you should double. A player hand value of 9, 10, or 11 would always be a good double when a dealer is showing 3, 4, 5, or 6. This is because the 3, 4, 5, and 6 are starting cards that are more likely to make the dealer bust.</p>
      <ul>
        <li><u>Always</u> double a 9 against a 3, 4, 5, or 6.</li>
        <li><u>Always</u> double a 10 against any dealer card other than a 10 or ace.</li>
        <li><u>Always</u> double an 11 against any dealer card other than an ace.</li>
        <li><u>Always</u> double a soft 18 or below against a 5 or 6.</li>
      </ul>
      <h3 id="when-to-split-in-blackjack">When to Split in Blackjack</h3>
      <ul>
        <li><u>Always</u> split aces and eights.<br />The ace is such a powerful card because pulling a ten on a split will give you a 21. Even though a 21 gained through a split is only paid 1:1, it is still a very advantageous situation. Splitting eights is important because it rids you of a 16 — the worst hand in blackjack.</li>
        <li><u>Never</u> split fives, tens, or faces.<br />Two fives total 10 which is a hand much better suited for doubling. Tens and face cards should not be split because they already total 20, which is a great hand on its own.</li>
      </ul>
      <h2 id="part-4-insurance-and-surrender">Part 4 – Insurance and Surrender</h2>
      <h3 id="insurance">Insurance</h3>
      <p>Insurance in blackjack is often misunderstood by players, and is a big money-maker for casinos. Naming this side-bet "insurance" was a brilliant marketing ploy, and some otherwise solid players will frequently make this bad bet to "insure" when they have a good hand. But actually, insurance is not always a bad bet. For players who can recognize when the remaining deck is rich in 10-valued cards, this can actually be a profitable side-bet.</p>
      <p>So, what exactly is "insurance" in blackjack anyway?</p>
      <p>Insurance is a proposition bet that is available only when the dealer's upcard is an ace.</p>
      <p>When the dealer turns up an ace, he will offer "insurance" to the players. Insurance bets can be made by betting up to half your original bet amount.</p>
      <p>The dealer will check to see if he has a 10-valued card underneath his ace, and if he does have blackjack, your winning insurance bet will be paid at odds of 2:1. You will still lose your original bet (unless you also have a blackjack), so the net effect is that you break even (assuming you bet the full half bet for insurance.) This is why the bet is described as "insurance", since it seems to protect your original bet against a dealer blackjack. Of course, if the dealer does not have blackjack, you'll lose the insurance bet, and still have to play the original bet out.</p>
      <p>Insurance is simply a side-bet offering 2:1 odds that the dealer has a 10-valued card underneath their ace. Not surprisingly, the casino has a substantial edge on this bet. In a single deck game, there are sixteen 10-valued cards. Assuming that you don't see any other cards, including your own, the tens compose 16 out of 51 remaining cards after the dealer's ace was removed. For the insurance bet to be a break-even bet, the hole card would have to be a ten 1 out of 3 times, but 16/51 is only 1 in 3.1875.</p>
      <p>That creates a 5.88% house edge on the insurance bet in single deck. It's even worse in six decks with a 7.40% house edge.</p>
      <p>Card counters can still beat the insurance bet, by only making the bet when they know that more than one-third of the remaining cards are tens.</p>
      <p>Unless you are card counter and know the deck is skewed sufficiently, just ignore the insurance bet. It doesn't matter whether you have a good hand or a bad hand.</p>
      <h3 id="taking-even-money-on-blackjack">Taking "Even Money" on Blackjack</h3>
      <p>If you have a blackjack when the dealer turns up an ace, he is likely to offer you "even money" instead of the insurance bet. If you accept, the dealer will pay you the amount of your original bet and discard your hand of blackjack, before he even checks under his ace to see if he has a blackjack as well.</p>
      <p>Many players think this sounds like a good deal, guaranteeing a profit even if the dealer has a blackjack. But that guaranteed profit comes at a price. You will win more money in the long run by holding out for the full $15 payout when the dealer does not have blackjack, even though you will sometimes end up empty-handed.</p>
      <p>"Even money" is nothing but an insurance bet on your blackjack, nothing more and nothing less. Let me show you how it works:</p>
      <p>Let's say you bet $10, and have a blackjack. You would normally collect $15 for this, unless the dealer also has a blackjack in which case you push. Let's assume that the dealer has an ace up, and you decide to take insurance for the full amount allowed of $5.</p>
      <p>Now, two things can happen:</p>
      <ol>
        <li>The dealer has a blackjack. You tie with the $10, but collect 2:1 on the $5 insurance bet for a total profit of $10.</li>
        <li>The dealer does not have blackjack. You lose the $5 insurance bet, but collect $15 for your blackjack. Your total profit is again $10.</li>
      </ol>
      <p>In either case, once you make the insurance bet you are guaranteed a profit of $10, which is an even money payout for your original bet. So, casinos allow you to eliminate the insurance bet altogether, and simply declare that you want "even money" for your blackjack when the dealer has an ace showing.</p>
      <p>The problem is that you are still making a bad bet on insurance, which costs you money. If you ignore the offer of even money, sometimes you get $15, and sometimes you get $0. But on average, you will collect slightly more than the $10 you are offered for even money.</p>
      <p>A player who does not count cards should simply never take the insurance bet, even the "even money" variety.</p>
      <h3 id="surrender">Surrender</h3>
      <p>Some games offer the player a chance to fold their hand, and forfeit half of their bet. This surrender option must be done as the very first action the player takes on the hand. In other words, you can't draw a card and then decide to bail out!</p>
      <p>Even when surrender is available, it is rarely used by players. Often, the rules posted at the table won't mention it even if the casino allows it. And many players just don't like the idea of surrendering a hand. But for a smart player, it is a useful option, and reduces the house advantage by about 0.08%.</p>
      <p>In the most common variety (known as "late" surrender), a player cannot surrender until after the dealer has checked for blackjack. If the dealer has blackjack, you will lose your entire bet with no chance of surrendering for half the cost.</p>
      <h2 id="part-5-rule-variations">Part 5 – Rule Variations</h2>
      <p>There are a few rules in blackjack that can vary slightly from casino to casino.</p>
      <h3 id="dealer-hits-soft-17">Dealer Hits Soft 17</h3>
      <p>Generally, the dealer in blackjack must hit if he has a total of 16 or less, and stand if he has 17 or more.</p>
      <p>But at some games there is an exception when the dealer has a "soft" 17.</p>
      <p>If you look at the table, you will see one of two phrases on the felt:</p>
      <ul>
        <li>Dealer Stands on All 17s: This is the simple version. The dealer will stand with any total of 17 or more, whether that total is "soft" or not. (This rule is abbreviated S17. The S is for Stand, not Soft!)</li>
        <li>Dealer Hits Soft 17: In casinos with this rule, the dealer will stand with any hard 17, but draw another card if he has a soft 17, such as (A, 2, 4). (This rule is abbreviated H17.)</li>
      </ul>
      <p>Seventeen is a weak hand, so if the dealer is allowed to try to improve the soft 17 hands, it makes the game tougher. When a dealer is allowed to hit soft 17, it adds about 0.2% to the house advantage.</p>
      <p>Years ago, the only "Hit Soft 17" games in the US were in and around Reno, Nevada. Almost all other areas used the better rule of standing on all 17s. Over the years, more and more casinos have switched to hitting soft 17, and there are now far more H17 games than S17 games.</p>
      <p>You can still find some games where the dealer stands on all 17s, even in casinos where some of the tables use the H17 rule. Look around!</p>
      <h3 id="double-after-split">Double After Split</h3>
      <p>After splitting a pair, many casinos will allow you to double-down on a two-card hand that arises as a result of the split. For example, if you split a pair of eights, and draw a three on the first hand, it is valuable to be able to double-down on the resulting hand of 11.</p>
      <p>This rule is fairly common, and it helps the player by about 0.12%.</p>
      <h3 id="resplitting-aces">Resplitting Aces</h3>
      <p>As mentioned in the previous section discussion on pair splitting, there are several common restrictions on splitting aces. You will receive only one card on each ace after splitting.</p>
      <p>Some casinos will allow you to resplit if you draw another ace, and some will not. That's true even if the casino allows resplits of all other pairs.</p>
      <p>When the casino does allow resplitting of aces, it helps the player by about 0.08%.</p>
      <h3 id="peek-or-no-peek-hole-card-or-no-hole-card">Peek or No Peek, Hole Card or No Hole Card</h3>
      <p>Many casinos in Europe, and some in other parts of the world, handle the dealer's second card differently. In these European "No Hole Card" games, the dealer only deals himself one card at the beginning of the round. After all the players have completed their hands, he deals his own second card and completes the hand.</p>
      <p>Contrast that with the normal US style of play. There, if the dealer has a ten or ace card up, he checks the other card immediately to see if he has a blackjack. If he does, the hand is over. This process of "peeking" under the hole card to check for blackjack means that players can only lose one bet per hand if the dealer has a blackjack.</p>
      <p>In a "No Hole Card" game, a player might split or double and have multiple bets at risk to a dealer blackjack, because the dealer cannot check ahead of time. This changes the optimal strategy, and means that players should usually not split or double against a dealer ten or ace upcard. (An exception is splitting aces against a dealer ten.)</p>
      <p>Note that there are a few "No Hole Card" games where the rules specifically say that only one bet will be collected from a player if the dealer has a blackjack. In those games, although there is no hole card, you can play the game as if there were. (That means you should play it as a "Peek" game, even though there's not really a peek!) It's all a bit confusing.</p>
      <p>When the "No Hole Card" rule is in use, and all bets are at risk to a dealer blackjack, it costs the player 0.11%, and players should revise their strategy appropriately.</p>
      <h3 id="the-five-card-charlie">The Five Card Charlie</h3>
      <p>Ok, this one's an extremely rare variation which I doubt you will see in any casinos today but I thought I'd mention. If the player draws five cards and doesn't bust then he/she automatically wins the hand (this is called a "Charlie").</p>
      <p>Similarly there is a rule variation whereby the player automatically wins when drawing seven cards without busting which is called a "Seven Card Charlie".</p>
      <h2 id="faq">FAQ</h2>
      <h4 id="do-the-suits-of-the-cards-make-a-difference">Do the suits of the cards make a difference?</h4>
      <p>Not at all. Unlike other card games, suits do not factor in at all in evaluating the cards.</p>
      <h4 id="is-counting-cards-legal">Is counting cards legal?</h4>
      <p>Yes! Read this article on <a href="https://www.blackjackinfo.com/card-counting/" target="_blank">card counting</a> for more information.</p>
      <h4 id="whats-next">What's next?</h4>
      <p>So, if you have made it this far, congratulations! You should have a good idea of what to expect when you sit down at a blackjack table in the casino or play a virtual game online.</p>
      <p>What we have not talked much about is how to actually make the best decisions while playing the game. That is a whole subject all its own. To have the best chance of winning, you should learn and practice Basic Strategy, which is the mathematically best way to play each hand against each possible dealer upcard.</p>
      <p>For a free chart that shows the right play in every case, visit the <a href="http://www.beatingbonuses.com/bjstrategy.php" target="_blank">Blackjack Strategy Calculator</a>.</p>
      <p>You're well on your way. Good luck!</p>
      <a href="#blackjack-rules-of-the-game">Back to top</a>
    </Fragment>
  ), []);

  return (
    <Popup ariaLabel="Information" className="info-popup" isOpen={isInfoPopupOpen} onRequestClose={onRequestClose} children={children} />
  );
};

const ProfilePopup = (props) => {
  logger.debug('ProfilePopup render', props);

  const { isProfilePopupOpen, user } = useStateContext();
  const [name, setName] = useState(user.name);
  const dispatch = useDispatchContext();
  const nameInputRef = useRef(null);
  const currentName = user.name;

  const onAfterOpen = useCallback(() => nameInputRef.current.select(), []);
  const onRequestClose = useCallback(() => dispatch({ type: 'toggleProfilePopup', isOpen: false }), []);

  const onChangeButtonClick = useCallback(() => {
    dispatch({ type: 'toggleProfilePopup', isOpen: false });
    setTimeout(() => dispatch({ type: 'changeName', name }), constants.POPUP_EXIT_TIMEOUT);
  }, [name]);

  const onNameInputChange = useCallback((event) => setName(event.currentTarget.value), []);
  const onNameInputKeyDown = useCallback((event) => handleEnterKeyDown(event, onChangeButtonClick), [onChangeButtonClick]);

  // allows popup to be memoized
  const children = useMemo(() => (
    <Fragment>
      <p>Don't like your name, {currentName}?</p>
      <div>
        <input ref={nameInputRef} type="text" minLength="1" maxLength="20" placeholder="Name" spellCheck="false" value={name} onChange={onNameInputChange} onKeyDown={onNameInputKeyDown} />
        <button className="silver" onClick={onChangeButtonClick}>Change</button>
      </div>
    </Fragment>
  ), [currentName, name]);

  return (
    <Popup ariaLabel="Profile" className="profile-popup" isOpen={isProfilePopupOpen} onAfterOpen={onAfterOpen} onRequestClose={onRequestClose} children={children} />
  );
};

const ChatPopup = (props) => {
  logger.debug('ChatPopup render', props);

  const { isChatPopupOpen, chatMessages, user } = useStateContext();
  const [message, setMessage] = useState(constants.DEFAULT_CHAT_MESSAGE);
  const dispatch = useDispatchContext();
  const messageInputRef = useRef(null);
  const currentUserId = user.id;

  const onAfterOpen = useCallback(() => messageInputRef.current.select(), []);
  const onRequestClose = useCallback(() => dispatch({ type: 'toggleChatPopup', isOpen: false }), []);

  const onSendButtonClick = useCallback(() => {
    dispatch({ type: 'sendChatMessage', message });
    setMessage(constants.DEFAULT_CHAT_MESSAGE);
  }, [message]);

  const onMessageInputChange = useCallback((event) => setMessage(event.currentTarget.value), []);
  const onMessageInputKeyDown = useCallback((event) => handleEnterKeyDown(event, onSendButtonClick), [onSendButtonClick]);
  const groupedChatMessages = useMemo(() => groupChatMessages(chatMessages), [chatMessages]);

  // allows popup to be memoized
  const children = useMemo(() => (
    <div>
      <div>
        <div>
          {groupedChatMessages.map((group, index) => {
            const groupClassNames = getClassNames({
              messages: true,
              system: group.authorId === constants.SYSTEM_ID,
              outgoing: group.authorId === currentUserId,
              incoming: group.authorId !== currentUserId
            })
            return (
              <div key={index} className={groupClassNames}>
                <h6>{group.authorName}</h6>
                {group.messages.map((text, index) => <p key={index}>{text}</p>)}
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <input ref={messageInputRef} type="text" minLength="1" maxLength="140" placeholder="Message" value={message} onChange={onMessageInputChange} onKeyDown={onMessageInputKeyDown} />
        <button className="silver" onClick={onSendButtonClick}>Send</button>
      </div>
    </div>
  ), [groupedChatMessages, currentUserId, message]);

  return (
    <Popup ariaLabel="Chat" className="chat-popup" isOpen={isChatPopupOpen} onAfterOpen={onAfterOpen} onRequestClose={onRequestClose} children={children} />
  );
};

const MusicPopup = (props) => {
  logger.debug('MusicPopup render', props);

  const { isMusicPopupOpen } = useStateContext();
  const dispatch = useDispatchContext();

  const onRequestClose = useCallback(() => dispatch({ type: 'toggleMusicPopup', isOpen: false }), []);

  // allows popup to be memoized
  const children = useMemo(() => (
    <iframe src="https://open.spotify.com/embed/playlist/7FJ5yarckSPshvmaP4ywBI" allowtransparency="true" allow="encrypted-media" />
  ), []);

  return (
    <Popup ariaLabel="Music" className="music-popup" isOpen={isMusicPopupOpen} onRequestClose={onRequestClose} children={children} />
  );
};

const SettingsPopup = (props) => {
  logger.debug('SettingsPopup render', props);

  const { isSettingsPopupOpen, settings } = useStateContext();
  const { soundEffects, shuffleAfterEveryRound, numDecks, blackjackPayout, insurancePayout, dealerStandsOn, dealerPeeksOn, playersCanDoubleOn, playersCanDoubleAfterSplit, playersCanSplitAnyTens, playersCanSplitAces, playersCanResplitAces, playersCanHitSplitAces, maxNumSplits, cardNumBonus, surrender, minBet, maxBet, minBuyIn, maxBuyIn } = settings;
  const dispatch = useDispatchContext();

  const onRequestClose = useCallback(() => dispatch({ type: 'toggleSettingsPopup', isOpen: false }), []);

  // called by each setting input below
  const onSettingsChange = useCallback((event) => {
    const target = event.currentTarget;
    const settingName = target.name;
    const settingValue = (target.type === 'checkbox') ? target.checked : getNumberOrString(target.value);

    dispatch({ type: 'updateSettings', settings: { ...settings, [settingName]: settingValue } });
  }, [settings]);

  // allows popup to be memoized
  const children = useMemo(() => (
    <Fragment>
      <label>
        <span>Sound effects</span>
        <input type="checkbox" name="soundEffects" checked={soundEffects} onChange={onSettingsChange} />
      </label>
      <label>
        <span>Shuffle after every round</span>
        <input type="checkbox" name="shuffleAfterEveryRound" checked={shuffleAfterEveryRound} onChange={onSettingsChange} />
      </label>
      <label>
        <span>Number of decks</span>
        <select name="numDecks" value={numDecks} onChange={onSettingsChange}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="8">8</option>
        </select>
      </label>
      <label>
        <span>Blackjack payout</span>
        <select name="blackjackPayout" value={blackjackPayout} onChange={onSettingsChange}>
          <option value="2">2:1</option>
          <option value="1.5">3:2</option>
          <option value="1.2">6:5</option>
          <option value="1">1:1</option>
        </select>
      </label>
      <label>
        <span>Insurance payout</span>
        <select name="insurancePayout" value={insurancePayout} onChange={onSettingsChange}>
          <option value="2">2:1</option>
        </select>
      </label>
      <label>
        <span>Dealer stands on</span>
        <select name="dealerStandsOn" value={dealerStandsOn} onChange={onSettingsChange}>
          <option value="S17">Soft 17</option>
          <option value="H17">Hard 17</option>
        </select>
      </label>
      <label>
        <span>Dealer peeks for blackjack on</span>
        <select name="dealerPeeksOn" value={dealerPeeksOn} onChange={onSettingsChange}>
          <option value="NP">No Peek</option>
          <option value="P">Ace/Ten</option>
          <option value="PA">Ace</option>
        </select>
      </label>
      <label>
        <span>Players can double on</span>
        <select name="playersCanDoubleOn" value={playersCanDoubleOn} onChange={onSettingsChange}>
          <option value="D2">Any Two Cards</option>
          <option value="D3">Any Three Cards</option>
          <option value="D4">Any Four Cards</option>
          <option value="D8">8-11</option>
          <option value="D9">9-11</option>
          <option value="D10">10-11</option>
          <option value="D11">11</option>
        </select>
      </label>
      <label>
        <span>Players can double after split</span>
        <input type="checkbox" name="playersCanDoubleAfterSplit" checked={playersCanDoubleAfterSplit} onChange={onSettingsChange} />
      </label>
      <label>
        <span>Players can split any tens</span>
        <input type="checkbox" name="playersCanSplitAnyTens" checked={playersCanSplitAnyTens} onChange={onSettingsChange} />
      </label>
      <label>
        <span>Players can split aces</span>
        <input type="checkbox" name="playersCanSplitAces" checked={playersCanSplitAces} onChange={onSettingsChange} />
      </label>
      <label>
        <span>Players can resplit aces</span>
        <input type="checkbox" name="playersCanResplitAces" checked={playersCanResplitAces} onChange={onSettingsChange} />
      </label>
      <label>
        <span>Players can hit split aces</span>
        <input type="checkbox" name="playersCanHitSplitAces" checked={playersCanHitSplitAces} onChange={onSettingsChange} />
      </label>
      <label>
        <span>Maximum number of splits</span>
        <select name="maxNumSplits" value={maxNumSplits} onChange={onSettingsChange}>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="U">Unlimited</option>
        </select>
      </label>
      <label>
        <span>Card number bonus</span>
        <select name="cardNumBonus" value={cardNumBonus} onChange={onSettingsChange}>
          <option value="NCC">None</option>
          <option value="5CC">5-Card Charlie</option>
          <option value="6CC">6-Card Charlie</option>
          <option value="7CC">7-Card Charlie</option>
        </select>
      </label>
      <label>
        <span>Surrender</span>
        <select name="surrender" value={surrender} onChange={onSettingsChange}>
          <option value="NS">No Surrender</option>
          <option value="LS">Late</option>
          <option value="ES">Early</option>
          <option value="FS">Full Early</option>
          <option value="AS">Anytime</option>
        </select>
      </label>
      <label>
        <span>Minimum bet</span>
        <span>
          <input type="number" name="minBet" min={constants.MIN_BET} max={maxBet} placeholder="Amount" value={minBet} onChange={onSettingsChange} />
        </span>
      </label>
      <label>
        <span>Maximum bet</span>
        <span>
          <input type="number" name="maxBet" min={minBet} max={constants.MAX_BET} placeholder="Amount" value={maxBet} onChange={onSettingsChange} />
        </span>
      </label>
      <label>
        <span>Minimum buy in</span>
        <span>
          <input type="number" name="minBuyIn" min={constants.MIN_BUY_IN} max={maxBuyIn} placeholder="Amount" value={minBuyIn} onChange={onSettingsChange} />
        </span>
      </label>
      <label>
        <span>Maximum buy in</span>
        <span>
          <input type="number" name="maxBuyIn" min={minBuyIn} max={constants.MAX_BUY_IN} placeholder="Amount" value={maxBuyIn} onChange={onSettingsChange} />
        </span>
      </label>
    </Fragment>
  ), [onSettingsChange]);

  return (
    <Popup ariaLabel="Settings" className="settings-popup" isOpen={isSettingsPopupOpen} onRequestClose={onRequestClose} children={children} />
  );
};

const QuitPopup = (props) => {
  logger.debug('QuitPopup render', props);

  const { isQuitPopupOpen } = useStateContext();
  const dispatch = useDispatchContext();

  const onRequestClose = useCallback(() => dispatch({ type: 'toggleQuitPopup', isOpen: false }), []);
  const onQuitButtonClick = useCallback(() => dispatch({ type: 'quit' }), []);
  const onCancelButtonClick = useCallback(() => onRequestClose(), [onRequestClose]);

  // allows popup to be memoized
  const children = useMemo(() => (
    <Fragment>
      <p>Had enough already?</p>
      <div>
        <button className="silver" onClick={onQuitButtonClick}>Quit</button>
        <button className="silver" onClick={onCancelButtonClick}>Cancel</button>
      </div>
    </Fragment>
  ), []);

  return (
    <Popup ariaLabel="Quit" className="quit-popup" isOpen={isQuitPopupOpen} onRequestClose={onRequestClose} children={children} />
  );
};

export { InfoPopup, ProfilePopup, ChatPopup, MusicPopup, SettingsPopup, QuitPopup };

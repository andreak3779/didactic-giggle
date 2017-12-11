// Author: Andrea Kaplen
// Created: 2017 September 25 to 28
//
// Assumptions:
// I am using a Strategy pattern for evaluating the various hands.
// The players are using a single deck of cards for a game.
// Jokers are not included in the deck of cards.
// The poker.js library user will need to do the following: 
// 1.) Create a DetermineWinner instance class, 
// 2.) Call the WhoWon methods passing an array of player data in strings. 
//     ex. "Joe, 3H, 4H, 5H, 6H, 8H"
// Aces are the highest value.
// The player's cards are not sorted by there value.

//abstract Strategy class that all strategy sub types are inheriting.
class HandStrategy {
    action(hand) { }
}

//concrete class that evaluates a hand for a flush.
class HandStrategyFlush extends HandStrategy {
    // Evaluate the hand of cards to see if it is a flush
    // 1. Check if each card is the same suit.
    // 2. Check if the cards are in consequetive number, after being sorted.
    action(cards) {

        var result = PlayerHand.isEveryCardSameSuit(cards);
        return result;
    }
}
//concrete class that evaluates a hand for three of a kind.
class HandStrategyThreeOfAKind extends HandStrategy {
    // Loop through the cards counting the cards that are the same value.
    action(cards) {
        var count = 0
        
        for (var index = 1; index < cards.length; index++) {
            if ((cards[index].rankValue - cards[index - 1].rankValue) === 0) {
                count++;
            }
        }
        return count === 2;
    }
}
//concrete class that evaluates a hand for one pair.
class HandStrategyOnePair extends HandStrategy {
    action(cards) {
        var count = 0;
        
        for (var index = 1; index < cards.length; index++) {
            if ((cards[index].rankValue - cards[index - 1].rankValue) === 0) {
                count++;
            }
        }
        return count == 1;
    }
}
//Class that represents a single card.
class Card {
    constructor(cardValue) {
        var cardValueString = String(cardValue);
        var cardRE = /(\w+)(\w+)/g;
        var results =[];
        results = cardRE.exec(cardValueString);

        this.rank = results[1];
        this.suit = results[2];
        this.rankValue = 0;
        //determine the rank value
        switch (this.rank) {
            case "A":
                this.rankValue = 14;
                break;
            case "J":
                this.rankValue = 11;
                break;
            case "Q":
                this.rankValue = 12;
                break;
            case "K":
                this.rankValue = 13;
                break;
            default:
                this.rankValue = Number.parseInt(this.rank);
                break;
        }
    }
}
//Class that represents a player's hand.
class PlayerHand {
    constructor(playerData) {
        var playervalues = String(playerData).split(",");
        this.playerName = playervalues.shift();
        var unsortedCards = [];
        playervalues.forEach(function (element) {
            unsortedCards.push(new Card(element));
        }, this);
        this.cards = this.sortCards(unsortedCards);
    }
    get highCard() {
        var sortedCards = this.sortCards(this.cards);
        return sortedCard[sortedCards.length - 1].cardValue;
    }

    sortCards(ary) {
        var rawcards = ary;
        var result = rawcards.sort(function (a, b) {
            if (a.rankValue < b.rankValue) {
                return -1;
            } else if (a.rankValue > b.rankValue) {
                return 1;
            } else {
                return 0;
            }
        })
        return result;
    }
    static isEveryCardSameSuit(playerCards) {
       
        var onlyClubs = playerCards.every(function(e){
            return e.suit === "C";
        });

        var onlyDiamonds = playerCards.every(function(e) {
            return e.suit === "D";
        });

        var onlyHearts = playerCards.every(function(e){
            return e.suit === "H";
        });

        var onlySpades = playerCards.every(function(e){
            return e.suit === "S";
        });

        return (onlyClubs || onlyDiamonds || onlyHearts || onlyDiamonds);
    }
}

class HandEvaluator {
    constructor(handStrategies, playerCards) {
        this.cards = playerCards;
        this.hands = handStrategies;
    }
    
    checkHand(cards) {
        var rank = 0;
        for (var i = 0; i < this.hands.length; i++) {
            var result = this.hands[i].action(this.cards);
            if (result) {
                rank = i + 1;
            }
        }
        return rank;
    }
    
}

//Determine the winning player(s).
class DetermineWinner {
    constructor () {
        this.handStrategies = [
            new HandStrategyOnePair(),
            new HandStrategyThreeOfAKind(),
            new HandStrategyFlush()];
    }
    
    WhoWon(playerData) 
    {

        var resultArray= [];
       
        for (var index = 0; index < playerData.length; index++) {
            var element = playerData[index];
            var hand = new PlayerHand(element);
            var he = new HandEvaluator(this.handStrategies,hand.cards);
            hand.handRank = he.checkHand(he.cards);
            resultArray.push(hand);
        }
    
        // Sort the player's hands by their handRank to find winnner.
        var sortedResults = resultArray.sort(function (a, b) {
            if (a.hankRank < b.handRank) {
                return -1;
            } else if (a.handRank > b.handRank) {
                return 1;
            } else {
                return 0;
            }
        });
    
        var finalResults = [];
        var highCardCheck = sortedResults.every(function(e){
            return e.handRank === 0;
        });
        
        if(highCardCheck) {
            // None of the players won with a hand, so now we need to check for high cards.
            finalResults = sortedResults.sort(function(a,b) {
                if(a.highCard < b.highCard) {
                    return -1;
                } else if (a.highCard > b.highCard) {
                    return 1;     
                } else {
                    return 0;
                }
            })
        } else { 
            var topRank = sortedResults[sortedResults.length -1 ].handRank;
            
            finalResults = sortedResults.filter(function(e,idx,hands) {
                return e.handRank === topRank;
            });
        }
        finalResults.forEach(function(e) {
            console.log( e.playerName + " ");
        });
    } 
}
//Unit Tests Section
/* function testPlayerHand() {
    var testdata = ["Joe, 3H, 4H, 5H, 6H, 8H",
        "Bob, 3C, 3D, 3S, 8C, 10D",
        "Sally, AC, 10C, 5C, 2S, 2C"
    ];

    var hand = new PlayerHand(testdata[0])
    console.log(hand.playerName);
    console.log(hand.cards);
} */

/* function testHandEvaluate() {
    var testdata = ["Joe, 3H, 4H, 5H, 6H, 8H",
        "Bob, 3C, 3D, 3S, 8C, 10D",
        "Sally, AC, 10C, 5C, 2S, 2C"
    ];
    //var hand = new PlayerHand(testdata[0]);
    //var hand = new PlayerHand(testdata[1]);
    var hand = new PlayerHand(testdata[2]);
    
    var handStrategies = [];
    handStrategies.push(new HandStrategyOnePair());
    handStrategies.push(new HandStrategyThreeOfAKind());
    handStrategies.push(new HandStrategyFlush());
    var he = new HandEvaluator(handStrategies,hand.cards);
    var result = he.checkHand(he.cards);
    console.log(hand.playerName,result);
} */

/* function testDetermineWinner() {
    var testdata = ["Joe, 3H, 4H, 5H, 6H, 8H",
    "Bob, 3C, 3D, 3S, 8C, 10D",
    "Sally, AC, 10C, 5C, 2S, 2C"];

    var w = new DetermineWinner();
    w.WhoWon(testdata);
} */
//testPlayerHand();
//testHandEvaluate();
//testDetermineWinner();
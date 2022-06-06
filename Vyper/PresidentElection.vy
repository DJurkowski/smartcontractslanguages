
struct PresidentCandidate:
    name: String[20]
    byteName: bytes32
    numberOfVotes: int128

struct Citizen:
    voteIdentifier: int128
    isVoted: bool
    isCitizenCanVote: bool
    isCitizenValidated: bool

validator: public(address)

citizens: public(HashMap[address, Citizen])

candidates: public(HashMap[int128, PresidentCandidate])

numberOfCandidates: public(int128)

@view
@external
def getCandidates() -> String[50]:
    return concat("0. ", self.candidates[0].name, " 1. ", self.candidates[1].name)

@external
def __init__(candidateNameFirst: String[20], candidateNameSecond: String[20]):
    self.validator = msg.sender

    self.candidates[0] = PresidentCandidate({
        name: candidateNameFirst,
        byteName: sha256(candidateNameFirst),
        numberOfVotes: 0
    })
    self.candidates[1] = PresidentCandidate({
        name: candidateNameSecond,
        byteName: sha256(candidateNameSecond),
        numberOfVotes: 0
    })
    self.numberOfCandidates += 2

@external
def validateVoteRight(voter: address):
    assert msg.sender == self.validator
    assert not self.citizens[voter].isVoted
    self.citizens[voter].isCitizenCanVote = True
    self.citizens[voter].isCitizenValidated = True

@external
def vote(proposal: int128):
    assert self.citizens[msg.sender].isCitizenValidated
    assert not self.citizens[msg.sender].isVoted
    assert proposal < self.numberOfCandidates
    self.citizens[msg.sender].voteIdentifier = proposal
    self.citizens[msg.sender].isVoted = True
    self.candidates[proposal].numberOfVotes += 1

@view
@internal
def _calculateVotes() -> int128:
    voteCounter: int128 = 0
    newPresidentId: int128 = 0
    for i in range(2):
        if self.candidates[i].numberOfVotes > voteCounter:
            voteCounter = self.candidates[i].numberOfVotes
            newPresidentId = i
    return newPresidentId

@view
@external
def calculateVotes() -> int128:
    return self._calculateVotes()

@view
@external
def newPresident() -> String[20]:
    return self.candidates[self._calculateVotes()].name
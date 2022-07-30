
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
    self.citizens[msg.sender].isCitizenCanVote = True
    self.citizens[msg.sender].isCitizenValidated = True

@external
def validateVoteRight(voter: address):
    assert msg.sender == self.validator
    assert not self.citizens[voter].isVoted
    assert not self.citizens[voter].isCitizenValidated
    self.citizens[voter].isCitizenCanVote = True
    self.citizens[voter].isCitizenValidated = True

@external
def vote(candidateId: int128):
    assert self.citizens[msg.sender].isCitizenValidated
    assert not self.citizens[msg.sender].isVoted
    assert candidateId < self.numberOfCandidates
    self.citizens[msg.sender].voteIdentifier = candidateId
    self.citizens[msg.sender].isVoted = True
    self.candidates[candidateId].numberOfVotes += 1

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
@internal
def calculateVotes() -> int128:
    return self._calculateVotes()

@view
@external
def getNewPresident() -> String[20]:
    return self.candidates[self._calculateVotes()].name

@view
@external
def getCandidatesNumberOfVotes(candidateId: int128) -> int128:
    if candidateId < self.numberOfCandidates and candidateId >= 0:
        return self.candidates[candidateId].numberOfVotes
    return -1
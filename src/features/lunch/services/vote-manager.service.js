class VoteManager {
  voteMap = new Map();

  hasVoteStatus(channelId) {
    return this.voteMap.has(channelId)
  }

  cacheVoteStatus(channelId, voteResult) {
    void this.voteMap.set(channelId, voteResult)
  }

  removeVoteStatus(channelId) {
    void this.voteMap.delete(channelId);
  }
}

export default new VoteManager();

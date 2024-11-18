
export function bindUserId (request, _response, done) {

  const content = request?.body;

  if (!content) return done();

  const cId = content.channelId || content.channel?.id || null;
  if (cId) request.channelId = cId;

  const uId = content.userId || content.user?.id || null;
  if (uId) request.userId = uId;

  if (uId || cId) {
    request.log.info({
      dooray: {
        user_id: uId,
        channel_id: cId
      }
    })
  }

  done();
}

# proxy 封装的方法
## user
- newAndSave
- getUserById
- getUserByEmail
- getUserByPhone
- getUserFocusById
- getUserFollowsById
- getUserCommoditiesById
- getHosterByCommodityId (getCommodityHosterById)
- getTopUser
- addFocus
- rmFocus
- updateUserInfo
- updateUserPass
- updateMyCommodity
- updateUserHeader

## commodity
- newAndSave
- getCommodityById
- getCommodities
- getCommodityHosterById (getHosterByCommodityId)
- updateCommodityById
- updateCommodityStatus
- onlineCommodity
- offlineCommodity
- blockCommodity

## message
- newAndSave
- getUnreadMessageCount
- getMessageById
- generateMessage
- getMessageUnread
- getMessageUnread
- updateMessageAsRead
- updateMessageAsUnread
- updateMessagesAsRead (多个)
- sendReplyMessage
- sendFollowMessage
- sendAtMessage
- sendNoticeMessage

## reply
- newAndSave
- getReplyById
- updateReply

## category
- newAndSave
- getCategory
- getCategoryByLeavel
- getCatedoryByParent

## admin

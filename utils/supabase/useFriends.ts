import { createClient } from './client'

export async function getFriends(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('Friends')
    .select(
      `
        requester_id,
        receiver_id,
        status,
        requester:User!fk_requester(username, image),
        receiver:User!fk_receiver(username, image)
      `
    )
    .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
    .eq('status', 'accepted')

  if (error) {
    console.error('Supabase error in getFriends:', error)
    throw new Error(error.message || 'Unknown error fetching friends')
  }
  return data
}

export async function sendFriendRequest(fromId: string, toId: string) {
  const supabase = createClient()
  return await supabase.from('Friends').insert({
    requester_id: fromId,
    receiver_id: toId,
    status: 'pending',
  })
}

export async function getIncomingRequests(userId: string) {
  const supabase = createClient()
  return await supabase
    .from('Friends')
    .select(`id, requester:User!fk_requester(username, image)`)
    .eq('receiver_id', userId)
    .eq('status', 'pending')
}

export async function acceptFriendRequest(requestId: number) {
  const supabase = createClient()
  return await supabase.from('Friends').update({ status: 'accepted' }).eq('id', requestId)
}

export async function sendFriendRequestByUsername(fromId: string, toUsername: string) {
  const supabase = createClient()

  const { data: toUser, error: userError } = await supabase
    .from('User')
    .select('auth_id')
    .eq('username', toUsername)
    .single()

  if (userError || !toUser) {
    return { error: new Error('User not found') }
  }

  return await sendFriendRequest(fromId, toUser.auth_id)
}

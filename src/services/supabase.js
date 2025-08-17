import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ebwoqaludvmgumzazuxn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVid29xYWx1ZHZtZ3VtemF6dXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MTY3ODksImV4cCI6MjA3MDk5Mjc4OX0.JRQb3CRmnNwkdY3SwnfdFDFlk81pjxXIeFA0Nu3cQeo'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Events related database operations
export const eventService = {
  // Get all events
  async getAllEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching events:', error)
      return []
    }
  },

  // Create a new event
  async createEvent(eventData) {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          title: eventData.title,
          date: eventData.date,
          description: eventData.description,
          icon: eventData.icon,
          status: eventData.status,
          created_at: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  },

  // Update an event
  async updateEvent(id, eventData) {
    try {
      const { data, error } = await supabase
        .from('events')
        .update({
          title: eventData.title,
          date: eventData.date,
          description: eventData.description,
          icon: eventData.icon,
          status: eventData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  },

  // Delete an event
  async deleteEvent(id) {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  },

  // Subscribe to real-time changes
  subscribeToEvents(callback) {
    return supabase
      .channel('events-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'events'
      }, callback)
      .subscribe()
  }
}

// Staff related database operations
export const staffService = {
  // Get all active staff members
  async getAllStaff() {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching staff:', error)
      return []
    }
  },

  // Create a new staff member
  async createStaff(staffData) {
    try {
      const { data, error } = await supabase
        .from('staff')
        .insert([{
          name: staffData.name,
          username: staffData.username,
          password: staffData.password,
          role: staffData.role,
          avatar: staffData.avatar || 'https://i.pravatar.cc/100?img=1',
          joined: staffData.joined || new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }),
          posts: 0,
          likes: 0,
          points: 0,
          hits: 0,
          is_active: true,
          created_at: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error creating staff:', error)
      throw error
    }
  },

  // Update staff member
  async updateStaff(id, staffData) {
    try {
      const { data, error } = await supabase
        .from('staff')
        .update({
          ...staffData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating staff:', error)
      throw error
    }
  },

  // Delete (deactivate) staff member
  async deleteStaff(id) {
    try {
      const { error } = await supabase
        .from('staff')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting staff:', error)
      throw error
    }
  },

  // Staff authentication
  async authenticateStaff(username, password) {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .eq('is_active', true)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error authenticating staff:', error)
      return null
    }
  },

  // Update staff stats
  async updateStaffStat(id, field) {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select(field)
        .eq('id', id)
        .single()
      
      if (error) throw error
      
      const currentValue = data[field] || 0
      const { data: updatedData, error: updateError } = await supabase
        .from('staff')
        .update({ 
          [field]: currentValue + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
      
      if (updateError) throw updateError
      return updatedData[0]
    } catch (error) {
      console.error('Error updating staff stat:', error)
      throw error
    }
  },

  // Get staff roles
  getAvailableRoles() {
    return [
      'Leader',
      'Developer', 
      'Administrator',
      'Community Manager',
      'Game Master',
      'God of Balance',
      'PvP Balance',
      'PvE Balance',
      'Moderator',
      'Moderator Jr',
      'VIP'
    ]
  }
}

// Posts related database operations
export const postService = {
  // Get all posts (for news section) - sorted by newest first
  async getAllPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false }) // Newest posts first
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching posts:', error)
      return []
    }
  },

  // Get paginated posts (for news section with pagination) - sorted by newest first
  async getPaginatedPosts(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false }) // Newest posts first
        .range(offset, offset + limit - 1)
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching paginated posts:', error)
      return []
    }
  },

  // Get total count of published posts
  async getTotalPostsCount() {
    try {
      const { count, error } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)
      
      if (error) throw error
      return count || 0
    } catch (error) {
      console.error('Error fetching posts count:', error)
      return 0
    }
  },

  // Get trending posts (max 3, descending order of likes - most likes first)
  async getTrendingPosts(limit = 3) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .eq('is_trending', true)
        .order('likes_count', { ascending: false }) // Descending order (most likes first)
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching trending posts:', error)
      return []
    }
  },

  // Update trending posts logic - max 3 posts with most likes
  async updateTrendingPosts() {
    try {
      // First, get all posts with 10+ likes ordered by likes (descending - most likes first)
      const { data: eligiblePosts, error: fetchError } = await supabase
        .from('posts')
        .select('id, likes_count')
        .eq('is_published', true)
        .gte('likes_count', 10)
        .order('likes_count', { ascending: false }) // Most likes first
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      // Reset all trending status first
      const { error: resetError } = await supabase
        .from('posts')
        .update({ is_trending: false })
        .eq('is_published', true)

      if (resetError) throw resetError

      // Set trending for top 3 posts (with most likes among eligible)
      if (eligiblePosts && eligiblePosts.length > 0) {
        const trendingIds = eligiblePosts.slice(0, 3).map(post => post.id)
        
        const { error: updateError } = await supabase
          .from('posts')
          .update({ is_trending: true })
          .in('id', trendingIds)

        if (updateError) throw updateError
      }

      return true
    } catch (error) {
      console.error('Error updating trending posts:', error)
      return false
    }
  },

  // Create a new post
  async createPost(postData, authorData) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt || postData.content.substring(0, 150) + '...',
          author_id: authorData.id,
          author_name: authorData.name,
          author_avatar: authorData.avatar,
          likes_count: 0,
          is_trending: false,
          is_published: true,
          created_at: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error

      // Update staff posts count
      await staffService.updateStaffStat(authorData.id, 'posts')
      
      // Update trending posts in case this new post affects trending status
      await postService.updateTrendingPosts()
      
      return data[0]
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  },

  // Like a post
  async likePost(postId, userIdentifier) {
    try {
      // Check if user already liked this post
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_identifier', userIdentifier)
        .single()

      if (existingLike) {
        return { success: false, message: 'Already liked this post' }
      }

      // Add like
      const { error: likeError } = await supabase
        .from('post_likes')
        .insert([{
          post_id: postId,
          user_identifier: userIdentifier,
          created_at: new Date().toISOString()
        }])

      if (likeError) throw likeError

      // Get updated likes count
      const { data: likesData, error: countError } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)

      if (countError) throw countError

      const newLikesCount = likesData.length

      // Update post likes count first
      const { error: updateError } = await supabase
        .from('posts')
        .update({ 
          likes_count: newLikesCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId)

      if (updateError) throw updateError

      // Update trending status with max 3 posts logic
      await postService.updateTrendingPosts();

      // Update author's likes count
      const { data: postData } = await supabase
        .from('posts')
        .select('author_id')
        .eq('id', postId)
        .single()

      if (postData) {
        await staffService.updateStaffStat(postData.author_id, 'likes')
      }

      return { success: true, likesCount: newLikesCount }
    } catch (error) {
      console.error('Error liking post:', error)
      throw error
    }
  },

  // Get posts by author
  async getPostsByAuthor(authorId) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', authorId)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching posts by author:', error)
      return []
    }
  },

  // Delete post
  async deletePost(postId, authorId) {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('author_id', authorId) // Ensure only author can delete
      
      if (error) throw error
      
      // Decrement staff posts count
      await supabase.rpc('decrement_staff_posts', { staff_id: authorId })
      
      return true
    } catch (error) {
      console.error('Error deleting post:', error)
      throw error
    }
  }
}

// Support tickets related database operations
export const supportService = {
  // Get all tickets (for admin)
  async getAllTickets() {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching tickets:', error)
      return []
    }
  },

  // Get pending tickets (for admin)
  async getPendingTickets() {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching pending tickets:', error)
      return []
    }
  },

  // Get resolved tickets (for admin)
  async getResolvedTickets() {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('status', 'resolved')
        .order('resolved_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching resolved tickets:', error)
      return []
    }
  },

  // Get tickets by user (for user side)
  async getTicketsByUser(userIdentifier) {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_identifier', userIdentifier)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user tickets:', error)
      return []
    }
  },

  // Create a new support ticket
  async createTicket(ticketData) {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert([{
          title: ticketData.title,
          description: ticketData.description,
          category: ticketData.category,
          priority: ticketData.priority || 'medium',
          status: 'pending',
          user_name: ticketData.user_name,
          user_email: ticketData.user_email,
          user_identifier: ticketData.user_identifier,
          created_at: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error creating ticket:', error)
      throw error
    }
  },

  // Update ticket status (admin only)
  async updateTicketStatus(ticketId, status, adminResponse = null, resolvedBy = null) {
    try {
      const updateData = {
        status: status,
        updated_at: new Date().toISOString()
      }

      if (adminResponse) {
        updateData.admin_response = adminResponse
      }

      if (status === 'resolved' && resolvedBy) {
        updateData.resolved_by = resolvedBy
        updateData.resolved_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('support_tickets')
        .update(updateData)
        .eq('id', ticketId)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating ticket status:', error)
      throw error
    }
  },

  // Delete ticket (admin only)
  async deleteTicket(ticketId) {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .delete()
        .eq('id', ticketId)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting ticket:', error)
      throw error
    }
  },

  // Get ticket categories
  getCategories() {
    return [
      'Technical Issue',
      'Account Problem',
      'Payment Issue',
      'Game Bug',
      'Feature Request',
      'General Inquiry',
      'Report Player',
      'Other'
    ]
  },

  // Get priority levels
  getPriorities() {
    return [
      { value: 'low', label: 'Low', color: 'text-green-500' },
      { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
      { value: 'high', label: 'High', color: 'text-orange-500' },
      { value: 'urgent', label: 'Urgent', color: 'text-red-500' }
    ]
  }
}

// Comments related database operations
export const commentService = {
  // Get comments for a post
  async getCommentsByPost(postId) {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select('*')
        .eq('post_id', postId)
        .is('parent_comment_id', null) // Only get top-level comments
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching comments:', error)
      return []
    }
  },

  // Get replies for a comment
  async getRepliesByComment(commentId) {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select('*')
        .eq('parent_comment_id', commentId)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching replies:', error)
      return []
    }
  },

  // Create a new comment
  async createComment(commentData) {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert([{
          post_id: commentData.post_id,
          user_name: commentData.user_name,
          user_identifier: commentData.user_identifier,
          content: commentData.content,
          parent_comment_id: commentData.parent_comment_id || null,
          created_at: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error creating comment:', error)
      throw error
    }
  },

  // Like a comment
  async likeComment(commentId, userIdentifier) {
    try {
      // Check if user already liked this comment
      const { data: existingLike } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_identifier', userIdentifier)
        .single()

      if (existingLike) {
        return { success: false, message: 'Already liked this comment' }
      }

      // Add like
      const { error: likeError } = await supabase
        .from('comment_likes')
        .insert([{
          comment_id: commentId,
          user_identifier: userIdentifier,
          created_at: new Date().toISOString()
        }])

      if (likeError) throw likeError

      // Get updated likes count
      const { data: likesData, error: countError } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)

      if (countError) throw countError

      const newLikesCount = likesData.length

      // Update comment likes count
      const { error: updateError } = await supabase
        .from('post_comments')
        .update({ 
          likes_count: newLikesCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId)

      if (updateError) throw updateError

      return { success: true, likesCount: newLikesCount }
    } catch (error) {
      console.error('Error liking comment:', error)
      throw error
    }
  },

  // Delete comment
  async deleteComment(commentId, userIdentifier) {
    try {
      const { error } = await supabase
        .from('post_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_identifier', userIdentifier) // Only allow deleting own comments
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw error
    }
  }
}

// Updates related database operations
export const updateService = {
  // Get all updates (for user side)
  async getAllUpdates() {
    try {
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching updates:', error)
      return []
    }
  },

  // Get all updates (for admin side)
  async getAllUpdatesAdmin() {
    try {
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching updates:', error)
      return []
    }
  },

  // Get featured updates
  async getFeaturedUpdates(limit = 5) {
    try {
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching featured updates:', error)
      return []
    }
  },

  // Create a new update
  async createUpdate(updateData) {
    try {
      const { data, error } = await supabase
        .from('updates')
        .insert([{
          title: updateData.title,
          content: updateData.content,
          version: updateData.version,
          category: updateData.category || 'general',
          priority: updateData.priority || 'medium',
          status: updateData.status || 'published',
          author_id: updateData.author_id,
          author_name: updateData.author_name,
          is_featured: updateData.is_featured || false,
          created_at: new Date().toISOString()
        }])
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error creating update:', error)
      throw error
    }
  },

  // Update an existing update
  async updateUpdate(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('updates')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating update:', error)
      throw error
    }
  },

  // Delete an update
  async deleteUpdate(id) {
    try {
      const { error } = await supabase
        .from('updates')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting update:', error)
      throw error
    }
  },

  // Get update categories
  getCategories() {
    return [
      'general',
      'bug-fix',
      'feature',
      'security',
      'performance',
      'ui-update',
      'maintenance'
    ]
  },

  // Get priority levels
  getPriorities() {
    return [
      { value: 'low', label: 'Low', color: 'text-green-500' },
      { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
      { value: 'high', label: 'High', color: 'text-orange-500' },
      { value: 'critical', label: 'Critical', color: 'text-red-500' }
    ]
  }
}
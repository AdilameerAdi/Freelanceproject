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
  // Get all posts (for news section) - trending posts first, then by creation date
  async getAllPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('is_trending', { ascending: false }) // Trending posts first
        .order('likes_count', { ascending: false }) // Then by most likes
        .order('created_at', { ascending: false }) // Then by newest
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching posts:', error)
      return []
    }
  },

  // Get paginated posts (for news section with pagination)
  async getPaginatedPosts(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_published', true)
        .order('is_trending', { ascending: false }) // Trending posts first
        .order('likes_count', { ascending: false }) // Then by most likes
        .order('created_at', { ascending: false }) // Then by newest
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
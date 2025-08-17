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

// Staff related database operations (for future use)
export const staffService = {
  // Get all staff members
  async getAllStaff() {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching staff:', error)
      return []
    }
  },

  // Update staff member
  async updateStaff(id, staffData) {
    try {
      const { data, error } = await supabase
        .from('staff')
        .update(staffData)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating staff:', error)
      throw error
    }
  }
}
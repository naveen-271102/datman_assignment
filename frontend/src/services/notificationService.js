import { toast } from 'react-toastify'

class NotificationService {
  constructor() {
    this.checkPermission()
    this.setupTaskReminders()
  }

  async checkPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications')
      return
    }

    if (Notification.permission !== 'granted') {
      await Notification.requestPermission()
    }
  }

  setupTaskReminders() {
    setInterval(() => {
      this.checkDueTasks()
    }, 60000) // Check every minute
  }

  async checkDueTasks() {
    try {
      const response = await fetch('/api/tasks/due')
      const tasks = await response.json()

      tasks.forEach(task => {
        this.showTaskReminder(task)
      })
    } catch (error) {
      console.error('Failed to check due tasks:', error)
    }
  }

  showTaskReminder(task) {
    // Browser notification
    if (Notification.permission === 'granted') {
      new Notification('Task Reminder', {
        body: task.description,
        icon: '/path/to/icon.png'
      })
    }

    // In-app notification
    toast.info(`Task Due: ${task.description}`, {
      position: 'top-right',
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  showNewTaskNotification(task) {
    toast.info(`New Task Assigned: ${task.description}`, {
      position: 'top-right',
      autoClose: 5000,
    })
  }
}

export const notificationService = new NotificationService() 
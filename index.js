// script.js
class ItineraryPlanner {
    constructor() {
        this.activities = JSON.parse(localStorage.getItem('activities')) || {
            1: [],
            2: [],
            3: []
        };
        this.form = document.getElementById('activity-form');
        this.daysContainer = document.getElementById('days-container');
        
        this.initializeEventListeners();
        this.renderDays();
    }

    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addActivity();
        });
    }

    addActivity() {
        const day = document.getElementById('day').value;
        const time = document.getElementById('time').value;
        const activity = document.getElementById('activity').value;
        const location = document.getElementById('location').value;
        const notes = document.getElementById('notes').value;

        const newActivity = {
            id: Date.now(),
            time,
            activity,
            location,
            notes
        };

        this.activities[day].push(newActivity);
        this.activities[day].sort((a, b) => a.time.localeCompare(b.time));
        
        this.saveToLocalStorage();
        this.renderDays();
        this.form.reset();
    }

    deleteActivity(day, id) {
        this.activities[day] = this.activities[day].filter(activity => activity.id !== id);
        this.saveToLocalStorage();
        this.renderDays();
    }

    renderDays() {
        this.daysContainer.innerHTML = '';
        
        for (let day = 1; day <= 3; day++) {
            const dayActivities = this.activities[day];
            const dayCard = document.createElement('div');
            dayCard.className = 'day-card';
            
            dayCard.innerHTML = `
                <h3>Day ${day}</h3>
                ${dayActivities.length === 0 ? 
                    '<p class="empty-day">No activities planned</p>' : 
                    dayActivities.map(activity => this.createActivityHTML(day, activity)).join('')}
            `;
            
            this.daysContainer.appendChild(dayCard);
        }
    }

    createActivityHTML(day, activity) {
        return `
            <div class="activity-item">
                <h4>${activity.activity}</h4>
                <p><strong>Time:</strong> ${this.formatTime(activity.time)}</p>
                <p><strong>Location:</strong> ${activity.location}</p>
                ${activity.notes ? `<p><strong>Notes:</strong> ${activity.notes}</p>` : ''}
                <div class="activity-actions">
                    <button class="btn btn-small btn-danger" onclick="planner.deleteActivity('${day}', ${activity.id})">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }

    formatTime(time) {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    saveToLocalStorage() {
        localStorage.setItem('activities', JSON.stringify(this.activities));
    }
}

// Initialize the planner
const planner = new ItineraryPlanner();
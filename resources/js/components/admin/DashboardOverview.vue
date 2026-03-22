<script setup lang="ts">
import { 
  TrendingUp, 
  Users, 
  Activity, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  MoreHorizontal,
  FolderKanban,
  Wrench,
  Mail,
  Zap
} from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  type ChartOptions
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
);

const props = defineProps<{
  stats: {
    projects: number;
    skills: number;
    contacts: number;
    timeline: number;
  }
}>();

const chartData = computed(() => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Visitor Traffic',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      borderColor: '#6366f1',
      pointBackgroundColor: '#6366f1',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#6366f1',
      fill: true,
      tension: 0.4,
      data: [30, 45, 38, 52, 48, 65, 72]
    }
  ]
}));

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: '#1e293b',
      titleColor: '#fff',
      bodyColor: '#cbd5e1',
      borderColor: '#334155',
      borderWidth: 1,
      padding: 12,
      displayColors: false
    }
  },
  scales: {
    x: { 
      grid: { display: false },
      ticks: { color: '#94a3b8', font: { size: 11 } }
    },
    y: { 
      grid: { color: 'rgba(148, 163, 184, 0.1)' },
      border: { display: false },
      ticks: { color: '#94a3b8', font: { size: 11 } }
    }
  }
};

const activityItems = [
  { id: 1, type: 'project', title: 'Portfolio Redesign', time: '2 hours ago', icon: FolderKanban, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400' },
  { id: 2, type: 'skill', title: 'Added TypeScript', time: '5 hours ago', icon: Wrench, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' },
  { id: 3, type: 'contact', title: 'New Message from Client', time: '1 day ago', icon: Mail, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400' },
];

const emit = defineEmits(['changeTab']);
</script>

<template>
  <div class="space-y-10 animate-fade-in">
    <!-- Stats Grid -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="(stat, key) in [
        { label: 'Projects', value: stats.projects, icon: FolderKanban, color: 'indigo', trend: '+12%', up: true },
        { label: 'Skills', value: stats.skills, icon: Wrench, color: 'emerald', trend: '+4%', up: true },
        { label: 'Messages', value: stats.contacts, icon: Mail, color: 'amber', trend: '-2%', up: false },
        { label: 'Experience', value: stats.timeline, icon: Activity, color: 'rose', trend: 'Stable', up: true },
      ]" :key="key" class="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
        <div class="flex items-center justify-between mb-4">
          <div :class="`h-12 w-12 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 flex items-center justify-center text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:scale-110 transition-transform duration-300`">
            <component :is="stat.icon" class="h-6 w-6" />
          </div>
          <div :class="`flex items-center gap-1 text-xs font-bold ${stat.up ? 'text-emerald-500' : 'text-rose-500'}`">
            <component :is="stat.up ? ArrowUpRight : ArrowDownRight" class="h-4 w-4" />
            {{ stat.trend }}
          </div>
        </div>
        <div>
          <p class="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{{ stat.label }}</p>
          <p class="mt-1 text-4xl font-black text-slate-900 dark:text-white">{{ stat.value }}</p>
        </div>
        <div class="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-slate-50 dark:bg-slate-800/50 -z-10 group-hover:scale-150 transition-transform duration-500"></div>
      </div>
    </div>

    <div class="grid gap-8 lg:grid-cols-3">
      <!-- Traffic Chart -->
      <div class="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Visitor Engagement</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">Total views over the last 30 days</p>
          </div>
          <div class="flex items-center gap-2">
            <button class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
              <Calendar class="h-5 w-5" />
            </button>
            <button class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
              <MoreHorizontal class="h-5 w-5" />
            </button>
          </div>
        </div>
        <div class="h-[320px] w-full">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Quick Actions & Recent Activity -->
      <div class="space-y-8">
        <!-- Quick Actions Card -->
        <div class="rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
          <div class="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          <div class="relative z-10">
            <div class="flex items-center gap-3 mb-6">
              <Zap class="h-6 w-6 text-indigo-200 fill-indigo-200/20" />
              <h3 class="text-xl font-bold tracking-tight">Rapid Actions</h3>
            </div>
            <div class="grid gap-3">
              <button @click="emit('changeTab', 'projects')" class="flex items-center justify-between w-full px-5 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-bold backdrop-blur-md transition-all border border-white/10 hover:border-white/20">
                <span>New Project Deployment</span>
                <ArrowUpRight class="h-4 w-4" />
              </button>
              <button @click="emit('changeTab', 'skills')" class="flex items-center justify-between w-full px-5 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-bold backdrop-blur-md transition-all border border-white/10 hover:border-white/20">
                <span>Update Skill Matrix</span>
                <ArrowUpRight class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">Real-time Feed</h3>
          <div class="space-y-6">
            <div v-for="item in activityItems" :key="item.id" class="flex items-start gap-4 group cursor-default">
              <div :class="`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${item.color}`">
                <component :is="item.icon" class="h-5 w-5" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{{ item.title }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <Clock class="h-3 w-3 text-slate-400" />
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ item.time }}</span>
                </div>
              </div>
            </div>
          </div>
          <button class="w-full mt-8 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border border-slate-100 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            View All Logs
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

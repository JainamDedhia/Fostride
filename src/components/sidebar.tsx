import { BarChart3, Home, MapPin, Trash2, Settings, Bell, Moon, Sun, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { useBinData } from './bin-data-context';
import { useSettings } from './settings-context';
import { useTranslation } from './translation-context';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { binData, alertsConfigured, binThresholds, resetBinData } = useBinData();
  const { binName, systemSettings, setSystemSettings, resetSettings } = useSettings();
  const { t } = useTranslation();
  
  const menuItems = [
    { id: 'overview', label: t('overview'), icon: Home },
    { id: 'bins', label: t('binStatus'), icon: Trash2 },
    { id: 'location', label: t('location'), icon: MapPin },
    { id: 'analytics', label: t('analytics'), icon: BarChart3 },
  ];

  // Generate dynamic alerts based on bin status and user preferences
  const generateAlerts = () => {
    const alerts = [];
    
    binData.forEach(bin => {
      // Critical level alert (90% or above) - always show regardless of configuration
      if (bin.fillLevel >= 90) {
        alerts.push({
          id: bin.id,
          message: `${bin.name} Critical!`,
          level: 'high',
          variant: 'destructive' as const,
          bgClass: 'bg-destructive/10',
          iconClass: 'text-destructive'
        });
      }
      // Threshold-based alert (if configured and reached)
      else if (alertsConfigured[bin.id] && bin.fillLevel >= binThresholds[bin.id]) {
        alerts.push({
          id: bin.id,
          message: `${bin.name} ${bin.fillLevel}%`,
          level: 'high',
          variant: 'destructive' as const,
          bgClass: 'bg-destructive/10',
          iconClass: 'text-destructive'
        });
      }
      // Warning level (75-89%) - show if alerts are configured or if bin is critical status
      else if (bin.fillLevel >= 75 && bin.fillLevel < 90) {
        // Show warning alerts for configured bins or if bin status is warning/critical
        if (alertsConfigured[bin.id] || bin.status === 'warning' || bin.status === 'critical') {
          alerts.push({
            id: bin.id,
            message: `${bin.name} ${bin.fillLevel}%`,
            level: 'medium',
            variant: 'outline' as const,
            bgClass: 'bg-yellow-100 dark:bg-yellow-900/20',
            iconClass: 'text-yellow-600'
          });
        }
      }
    });
    
    return alerts;
  };

  const alerts = generateAlerts();

  return (
    <div className="w-full bg-card border-r border-border flex flex-col h-screen xl:h-full">
      <div className="p-3 sm:p-4 md:p-5 xl:p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 xl:h-8 xl:w-8 text-primary shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-sm sm:text-base xl:text-lg font-semibold truncate">{binName}</h1>
            <p className="text-xs xl:text-sm text-muted-foreground truncate">{t('wasteManagementSystem')}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2 sm:p-3 xl:p-4 overflow-y-auto">
        <div className="space-y-1 xl:space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'secondary' : 'ghost'}
                className="w-full justify-start text-xs sm:text-sm xl:text-base py-2 xl:py-3 px-2 sm:px-3"
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="h-4 w-4 mr-2 xl:mr-3 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Button>
            );
          })}
        </div>

        <div className="mt-4 sm:mt-6 xl:mt-8">
          <h3 className="text-xs xl:text-sm font-medium text-muted-foreground mb-2 xl:mb-3 px-2 sm:px-3">{t('alerts')}</h3>
          <div className="space-y-1 sm:space-y-2">
            {alerts.length > 0 ? (
              alerts.map(alert => (
                <div key={alert.id} className={`flex items-center justify-between p-2 ${alert.bgClass} rounded-md`}>
                  <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                    <Bell className={`h-3 w-3 xl:h-4 xl:w-4 ${alert.iconClass} shrink-0`} />
                    <span className="text-xs xl:text-sm truncate">{alert.message}</span>
                  </div>
                  <Badge 
                    variant={alert.variant} 
                    className={`text-xs shrink-0 ml-1 ${
                      alert.level === 'high' 
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700'
                    }`}
                  >
                    {alert.level === 'high' ? 'High' : 'Med'}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-xs xl:text-sm text-muted-foreground italic px-2 sm:px-3">
                {t('noAlerts')}
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="p-2 sm:p-3 xl:p-4 border-t border-border space-y-2 xl:space-y-3">
        <div className="flex items-center justify-between px-2 xl:px-3 py-1 sm:py-2">
          <div className="flex items-center gap-1 sm:gap-2 text-xs xl:text-sm text-muted-foreground min-w-0 flex-1">
            {systemSettings.darkMode ? <Moon className="h-3 w-3 xl:h-4 xl:w-4 shrink-0" /> : <Sun className="h-3 w-3 xl:h-4 xl:w-4 shrink-0" />}
            <span className="truncate">{t('darkMode')}</span>
          </div>
          <Switch 
            checked={systemSettings.darkMode}
            onCheckedChange={(checked) => {
              setSystemSettings(prev => ({ ...prev, darkMode: checked }));
              if (checked) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            }}
            size="sm"
            className="shrink-0"
          />
        </div>
        
        <Button 
          variant="ghost" 
          className={`w-full justify-start text-xs sm:text-sm xl:text-base py-2 xl:py-3 px-2 sm:px-3 ${activeTab === 'settings' ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="h-4 w-4 mr-2 xl:mr-3 shrink-0" />
          <span className="truncate">{t('settings')}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-xs sm:text-sm xl:text-base py-2 xl:py-3 px-2 sm:px-3"
          onClick={() => {
            resetBinData();
            resetSettings();
            setActiveTab('overview');
          }}
        >
          <RotateCcw className="h-4 w-4 mr-2 xl:mr-3 shrink-0" />
          <span className="truncate">{t('reset')}</span>
        </Button>
      </div>
    </div>
  );
}
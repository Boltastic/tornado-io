export class AdService {
  private static instance: AdService;
  private isLoaded: boolean = true;

  public static getInstance(): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService();
    }
    return AdService.instance;
  }

  public showRewardedAd(
    placement: string,
    onSuccess: () => void,
    onCancel?: () => void
  ): Promise<boolean> {
    return new Promise((resolve) => {
      // Safe fallback / mock ad presentation for sandbox environment
      const confirmed = window.confirm(
        `[REWARDED AD - ${placement}]\n\nWatch a quick 5-second sponsor video to earn your reward?\n(Simulated Rewarded Ad for Tornado.io)`
      );

      if (confirmed) {
        setTimeout(() => {
          onSuccess();
          resolve(true);
        }, 300);
      } else {
        if (onCancel) onCancel();
        resolve(false);
      }
    });
  }
}

export const adService = AdService.getInstance();

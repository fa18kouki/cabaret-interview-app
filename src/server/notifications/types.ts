export type NotificationEvent = {
  type: "OFFER_RECEIVED";
  payload: {
    offerId: string;
    castUserId: string;
    castLineUserId: string | null;
    castEmail: string | null;
    storeName: string;
    storeArea: string;
    offerMessage: string;
  };
};

import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { CustomerInfo, PurchasesOffering } from 'react-native-purchases';
import Config from 'react-native-config';

const membershipTypes = {
  appleMonthly: 'scriptureMonthly',
  appleAnnually: 'scriptureAnnnual',
};

function useRevHook() {
  const [currentOffering, setCurrentOffering] = useState(PurchasesOffering);
  const [customerInfo, setCustomerInfo] = useState(CustomerInfo);

  const isProMember = customerInfo?.entitlements.active.pro;

  useEffect(() => {
    const fetchData = async () => {
      Purchases.setLogLevel(Purchases.LOG_LEVEL.INFO);

      if (Platform.OS === 'ios') {
        Purchases.configure({ apiKey: Config.REVENUECAT_APPLE_API_KEY });
      }

      const offerings = await Purchases.getOfferings();
      const customerInfo = await Purchases.getCustomerInfo();

      setCustomerInfo(customerInfo);
      setCurrentOffering(offerings.current);
    };
    fetchData().catch(() => {});
  }, []);

  useEffect(() => {
    const customerInfoUpdated = async (purchaserInfo) => {
      setCustomerInfo(purchaserInfo);
    };

    Purchases.addCustomerInfoUpdateListener(customerInfoUpdated);
  }, []);

  return { currentOffering, customerInfo, isProMember };
}

export default useRevHook;

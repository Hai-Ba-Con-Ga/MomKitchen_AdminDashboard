import { KitchenAdmin } from '@/types/@mk/entity/kitchen';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import KitchenApi from '../service/kitchen.api';
import UserApi from '../service/user.api';


const useKitchenData = () => {
// const [orderData, setOrderData] = useState<OrderAdmin>();
const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });
  const [sortState, setSortState] = useState<SortingState>([]);
  const [keyword, setKeyword] = useState<string>();
  const [totalRows, setTotalRows] = useState<number>(0);
  const [id, setId] = useState<string>();
  const [ownerId, setOwnerId] = useState<string>();
   // Define the fetchKitchenDataFunction that fetches orders using the OrderApi
   const fetchKitchenDataFunction = async () => {
    try {
      const response = await KitchenApi.getKitchens({
        paging: pagination, // Pass the pagination state
        sort: sortState,     // Pass the sort state
        keyword,             // Pass the keyword
      });
      setTotalRows(response?.totalCount ?? 0);
      // Return the data from the response
      return response?.data;
    }
    catch(e){
      console.log(e);
      throw e
    }
  };
   // Define your initial query key, including dependencies like pagination, sorting, and keyword 
   // TODO: use debounce technique to prevent many calls at a short time
   const queryKey = ['kitchens', pagination, sortState, keyword];

   // Fetch order data using React Query's useQuery hook
   const { data: kitchenData,
    refetch : refreshKitchenData
    //  isLoading, error
     } = useQuery(queryKey, fetchKitchenDataFunction,{
    onError:(err) => console.log("error at hook",err)
    
   });
 
   // Define your mutation functions for creating, updating, and deleting orders
  //  const createOrder = useMutation(createOrderFunction, {
  //    // You can specify onSuccess and onError callbacks here
  //  });
  // Define the updateKitchenFunction to update an order using the OrderApi
  const updateKitchenFunction = async (kitchen: KitchenAdmin) => {
      const response = await KitchenApi.updateKitchen(kitchen);
      // You can handle the success scenario here if needed
      return response?.data; // Return the updated order data
  };
   const updateKitchen = useMutation(updateKitchenFunction, {
     // You can specify onSuccess and onError callbacks here
   });
   // Define the deleteKitchenFunction to delete an order using the OrderApi
  const deleteKitchenFunction = async (id: string) => {
      const response = await KitchenApi.deleteKitchen(id);
      // You can handle the success scenario here if needed
      return response?.data; // Return any data indicating the success of deletion
   
  };
  const deleteKitchen = useMutation(deleteKitchenFunction, {
    // You can specify onSuccess and onError callbacks here
  });
  useEffect(()=>{
    console.log("Effect",id);
  },[id])
   const getKitchenDetailFunction = async () => {
    console.log("Id",id);
    
    const response =  await KitchenApi.getKitchenDetail(id);
    return response.data;
   }

   const {data: kitchenDetail, isLoading: isLoadingDetail} = useQuery(["KitchenDetail",id],getKitchenDetailFunction,{});
  useEffect(()=>{
    console.log("Effect",ownerId);
  },[ownerId])
   const getOwnerDetailFunction = async () => {
    
    const response =  await UserApi.getUserDetail(ownerId);
    return response?.data?.data;
   }

   const {data: ownerDetail} = useQuery(["KitchenDetail", ownerId],getOwnerDetailFunction,{});
  return { kitchenData, setSortState, setKeyword, setPagination, updateKitchen, deleteKitchen,kitchenDetail, setId, totalRows,refreshKitchenData, ownerDetail, setOwnerId, detailState: {
    isLoadingDetail
  } };
}

export default useKitchenData